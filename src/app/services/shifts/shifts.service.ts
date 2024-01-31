import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { ShiftInterface } from 'src/app/interfaces/shift-interface';

@Injectable({
  providedIn: 'root',
})
export class ShiftsService {
  constructor(private firestore: Firestore) {}

  async addShift(shift: ShiftInterface) {
    try {
      const shiftsCollection = collection(this.firestore, 'shifts');
      await addDoc(shiftsCollection, shift);
    } catch (error) {
      console.error('Error adding shift: ', error);
      throw new Error('Failed to add shift.');
    }
  }

  async getShiftsByUser(
    userUID: string,
    workplace: string,
    fromDate: string,
    toDate: string
  ): Promise<ShiftInterface[]> {
    try {
      const shiftsCollection = collection(this.firestore, 'shifts');
      let shiftsQuery = query(
        shiftsCollection,
        where('userUID', '==', userUID)
      );

      if (workplace && workplace !== '-') {
        shiftsQuery = query(shiftsQuery, where('workplace', '==', workplace));
      }
      if (fromDate) {
        shiftsQuery = query(shiftsQuery, where('date', '>=', fromDate));
      }
      if (toDate) {
        shiftsQuery = query(shiftsQuery, where('date', '<=', toDate));
      }

      const shiftsSnapshot = await getDocs(shiftsQuery);

      const shifts: ShiftInterface[] = [];
      shiftsSnapshot.forEach((doc) => {
        const shiftData = doc.data() as ShiftInterface;
        shiftData.id = doc.id;
        shifts.push(shiftData);
      });
      return shifts;
    } catch (error) {
      console.error('Error getting shifts by user:', error);
      return [];
    }
  }

  async getShiftById(shiftId: string): Promise<ShiftInterface | null> {
    try {
      if (!shiftId) {
        console.error('Invalid shiftId:', shiftId);
        return null;
      }

      const shiftDoc = await getDoc(doc(this.firestore, 'shifts', shiftId));
      const shiftData = shiftDoc.data();

      return shiftData as ShiftInterface;
    } catch (error) {
      console.error('Error getting shift by ID:', error);
      return null;
    }
  }

  async updateShift(shiftId: string, updatedShift: Partial<ShiftInterface>) {
    try {
      const shiftDocRef = doc(this.firestore, 'shifts', shiftId);

      const startDateTime = new Date(
        `${updatedShift.date} ${updatedShift.startTime}`
      );
      const endDateTime = new Date(
        `${updatedShift.date} ${updatedShift.endTime}`
      );

      if (endDateTime < startDateTime) {
        endDateTime.setDate(endDateTime.getDate() + 1);
      }
      const durationInHours =
        (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
      updatedShift.profit = 0.2 * (updatedShift.wage ?? 0) * durationInHours;

      await updateDoc(shiftDocRef, updatedShift);
    } catch (error) {
      console.error('Error updating shift: ', shiftId);
      throw new Error('Failed to update shift.');
    }
  }

  async getUpcomingShift(userUID: string): Promise<ShiftInterface | null> {
    try {
      const shiftsCollection = collection(this.firestore, 'shifts');
      const now = new Date();

      const upcomingShiftsQuery = query(
        shiftsCollection,
        where('userUID', '==', userUID),
        where('date', '>=', now.toISOString())
      );

      const upcomingShiftsSnapshot = await getDocs(upcomingShiftsQuery);

      if (upcomingShiftsSnapshot.empty) {
        return null;
      }

      let upcomingShift: ShiftInterface | null = null;
      upcomingShiftsSnapshot.forEach((doc) => {
        const shiftData = doc.data() as ShiftInterface;
        if (
          !upcomingShift ||
          new Date(shiftData.date) < new Date(upcomingShift.date)
        ) {
          upcomingShift = shiftData;
        }
      });
      return upcomingShift;
    } catch (error) {
      console.error('Error getting upcoming shift: ', error);
      return null;
    }
  }

  async getPastShifts(
    userUID: string,
    last7Days: Date[]
  ): Promise<ShiftInterface[]> {
    try {
      const shiftsCollection = collection(this.firestore, 'shifts');
      const shiftsQuery = query(
        shiftsCollection,
        where('userUID', '==', userUID)
      );

      const shiftsSnapshot = await getDocs(shiftsQuery);

      const pastShifts: ShiftInterface[] = [];

      shiftsSnapshot.forEach((doc) => {
        const shiftData = doc.data() as ShiftInterface;
        shiftData.id = doc.id;

        const shiftDate = new Date(shiftData.date);

        if (last7Days.some((day) => this.isSameDay(day, shiftDate))) {
          pastShifts.push(shiftData);
        }
      });

      return pastShifts;
    } catch (error) {
      console.error('Error getting past shifts: ', error);
      return [];
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}
