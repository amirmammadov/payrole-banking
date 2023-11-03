"use client";

import axios from "axios";

import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from "react";

type DataType = {
  _id: string;
  firstName: string;
  job: string;
};

interface ContextProps {
  data: DataType;
}

const GlobalContext = createContext<ContextProps>({
  data: { _id: "", firstName: "", job: "" },
});

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<DataType>({
    _id: "",
    firstName: "",
    job: "",
  });

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get("/api/user/me");
        setData(response.data.data);
      } catch (error: any) {
        throw new Error(error.message);
      }
    };

    getUserInfo();
  }, []);

  return (
    <GlobalContext.Provider value={{ data }}>{children}</GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
