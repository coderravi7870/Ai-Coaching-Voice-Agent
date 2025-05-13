"use client";
import { useUser } from "@stackframe/stack";
import { useMutation } from "convex/react";
import React, { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import { UserContext } from "./_context/UserContext";

const AuthProvider = ({ children }) => {
  const user = useUser();
  const CreateUser = useMutation(api.users.createUser);
  const [userData, setUserData] = useState();

  useEffect(() => {
    user && CreateNewUser();
  }, [user]);

  const CreateNewUser = async () => {
    const result = await CreateUser({
      name: user?.displayName,
      email: user.primaryEmail,
    });

    
    setUserData(result);
  };

  return (
    <div>
      <UserContext.Provider value={{ userData, setUserData }}>
        {children}
      </UserContext.Provider>
    </div>
  );
};

export default AuthProvider;
