const express = require("express");

const router = express.Router();

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Renan Fayad",
    image:
      "https://scontent.fcgh7-1.fna.fbcdn.net/v/t1.6435-9/46882033_2167690989948400_5943887528212824064_n.jpg?_nc_cat=100&cb=99be929b-3346023f&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeHPiT65MEyNkzv0A0mKlzzioNg9qA5fcIug2D2oDl9wi5rJQE4chjVs9SjD-RiiZ55xQPUzNlIM_HKwpXofIDx3&_nc_ohc=v0X0FiNblP4AX9ZYx3O&_nc_ht=scontent.fcgh7-1.fna&oh=00_AfD-H46Qx7qQE0MxZBJUHHHT9QdOtlRKia5dqTd82lx6cw&oe=64FC1CA3",
    places: 3,
  },
];

router.get("/", (req, res, next) => {
  const userId = req.params.uid;
  const user = DUMMY_USERS.find((item) => item.id === userId);

  res.json(user);
});

module.exports = router;
