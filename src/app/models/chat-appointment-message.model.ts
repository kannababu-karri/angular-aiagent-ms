export interface ChatMessage {
    //sender: 'user' | 'bot';
    //message: string;
    //doctors?: Doctor[]; // optional list of doctors to display
    //slots?: Slot[];
    sender: 'user' | 'bot';
    message: string;
    type?: 'text' | 'specializations' | 'doctors' | 'slots';
    options?: any[]; // specializations, doctors, or slots
}

export interface Specialization {
    id: number;
    name: string;
}

export interface Doctor {
    doctorId: string;
    name: string;
    specializationName: string;
}

export interface Slot {
    slotId: number;
    slotDate: string;
    startTime: string;
    endTime: string;
}