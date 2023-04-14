import React from "react";

import UsersList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      id: "u1",
      name: "Renan Fayad",
      image:
        "https://media.licdn.com/dms/image/C4E03AQH5HDkBly2nqg/profile-displayphoto-shrink_800_800/0/1655491533997?e=1686787200&v=beta&t=D8XWI1VbSkxRhrKDZx7tzEECpcobQ40La092pvK1sOw",
      places: 3,
    },
  ]; // Dummy data for the front end environment (that's why its named in caps)

  return <UsersList items={USERS} />;
};

export default Users;
