import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { auth, db } from '../auth/firebase-config.js';

class UserManager {
    constructor() {
        this.user = null;
        this.userData = null;
        this.setupAuthListener();
    }

    setupAuthListener() {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                this.user = user;
                await this.loadUserData();
            } else {
                this.user = null;
                this.userData = null;
            }
        });
    }

    async loadUserData() {
        if (!this.user) return;

        const userRef = doc(db, 'users', this.user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            this.userData = userSnap.data();
        } else {
            // Create new user document
            this.userData = {
                displayName: this.user.displayName,
                email: this.user.email,
                photoURL: this.user.photoURL,
                xp: 0,
                level: 1,
                completedChallenges: [],
                createdAt: new Date().toISOString()
            };
            await setDoc(userRef, this.userData);
        }
    }

    async updateUserProfile(data) {
        if (!this.user) return;

        const userRef = doc(db, 'users', this.user.uid);
        await updateDoc(userRef, data);
        this.userData = { ...this.userData, ...data };
    }

    async completeChallenge(challengeId, timeTaken) {
        if (!this.user) return;

        const challengeRef = doc(db, 'challenges', challengeId);
        const completionRef = doc(collection(challengeRef, 'completions'), this.user.uid);

        const completionData = {
            userId: this.user.uid,
            completedAt: new Date().toISOString(),
            timeTaken: timeTaken,
            xpEarned: 10 // Base XP for completion
        };

        // Add bonus XP for quick completion
        if (timeTaken < 300) { // Less than 5 minutes
            completionData.xpEarned += 5;
        }

        await setDoc(completionRef, completionData);

        // Update user's XP and level
        const newXp = this.userData.xp + completionData.xpEarned;
        const newLevel = Math.floor(newXp / 100) + 1; // Level up every 100 XP

        await this.updateUserProfile({
            xp: newXp,
            level: newLevel,
            completedChallenges: [...this.userData.completedChallenges, challengeId]
        });

        // Update leaderboard
        const leaderboardRef = doc(db, 'leaderboard', this.user.uid);
        await setDoc(leaderboardRef, {
            userId: this.user.uid,
            displayName: this.userData.displayName,
            xp: newXp,
            level: newLevel,
            completedChallenges: this.userData.completedChallenges.length + 1
        });
    }

    async getLeaderboard(limit = 10) {
        const leaderboardRef = collection(db, 'leaderboard');
        const q = query(leaderboardRef, where('xp', '>', 0));
        const snapshot = await getDocs(q);
        
        const leaderboard = [];
        snapshot.forEach(doc => {
            leaderboard.push(doc.data());
        });

        return leaderboard
            .sort((a, b) => b.xp - a.xp)
            .slice(0, limit);
    }

    async getUserStats() {
        if (!this.user) return null;

        return {
            xp: this.userData.xp,
            level: this.userData.level,
            completedChallenges: this.userData.completedChallenges.length,
            nextLevelXp: (this.userData.level * 100) - this.userData.xp
        };
    }
}

// Initialize user manager
const userManager = new UserManager();
export default userManager; 