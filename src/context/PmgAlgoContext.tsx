import React, { createContext, useState } from 'react';
 
export interface IFormikFormChangeContextProps {
    availablePower: number;
    totalPower: number;
    updateAvailablePower: (availablePower: number) => void;
    updateTotalPower: (totalPower: number) => void;
}
 
export const PmgPowerValuesContext = createContext<IFormikFormChangeContextProps | null>(null);
 
type Props = {
    children: React.ReactNode;
};
 
const PmgPowerValuesContextProvider = ({ children }: Props) => {
    const [powerValues, setPowerValues] = useState({ totalPower: 0, availablePower: 0 });
    const updateAvailablePower = (availablePower) => {
        setPowerValues((state)=> ({ ...state, availablePower }));
    }

    const updateTotalPower = (totalPower) => {
        setPowerValues((state) => ({ ...state, totalPower }));
    }
 
    return (
            <PmgPowerValuesContext.Provider
                value={{
                    totalPower: powerValues.totalPower,
                    availablePower: powerValues.availablePower,
                    updateAvailablePower,
                    updateTotalPower
                }}
            >
                {children}
            </PmgPowerValuesContext.Provider>
    );
};
export default PmgPowerValuesContextProvider;