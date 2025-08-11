// Demo user setup script
import { auth, db } from './firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const createDemoUsers = async () => {
  try {
    console.log('Creating demo users...');
    
    // Create parent demo user
    const parentResult = await createUserWithEmailAndPassword(auth, 'parent@demo.com', 'demo123');
    await setDoc(doc(db, 'users', parentResult.user.uid), {
      name: 'Sarah Johnson',
      email: 'parent@demo.com',
      role: 'parent',
      createdAt: new Date().toISOString(),
      children: ['emma-johnson-id']
    });
    console.log('Parent demo user created');

    // Create admin demo user
    const adminResult = await createUserWithEmailAndPassword(auth, 'admin@demo.com', 'admin123');
    await setDoc(doc(db, 'users', adminResult.user.uid), {
      name: 'School Administrator',
      email: 'admin@demo.com',
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    console.log('Admin demo user created');

    return { success: true };
  } catch (error) {
    console.error('Error creating demo users:', error);
    return { success: false, error: error.message };
  }
};
