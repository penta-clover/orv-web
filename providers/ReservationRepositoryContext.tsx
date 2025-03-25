'use client';

import { ReservationRepository } from "@/domain/repository/ReservationRepository";
import { createContext, ReactNode, useContext } from "react";
import { useApi } from "./ApiContext";
import { useStorage } from "./StorageContext";
import { ReservationRepositoryImpl } from "@/data/repository/ReservationRepositoryImpl";


const ReservationRepositoryContext = createContext<ReservationRepository | null>(null);

interface ReservationRepositoryProviderProps {
    children: ReactNode;
}

export function ReservationRepositoryProvider({
    children,
}: ReservationRepositoryProviderProps) {
    const api = useApi();
    const storage = useStorage();
    const reservationRepository = new ReservationRepositoryImpl(api, storage);

    return (
        <ReservationRepositoryContext.Provider value={reservationRepository}>
            {children}
        </ReservationRepositoryContext.Provider>
    )
}

export function useReservationRepository(): ReservationRepository {
    const context = useContext(ReservationRepositoryContext);
    if (!context) throw new Error("Provider가 없어욥!");
    return context;
}