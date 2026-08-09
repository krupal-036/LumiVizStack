import { NextFunction, Response } from "express";
import { getUserByField } from "../../repositories/user.repo";
import { HttpStatus } from "../../constants/http-status.enum";

export const validateUser = async (req: any, res: Response, next: NextFunction) => {
  const { id } = req.user;
  try {
    const user = await getUserByField({ _id: id });

    if (!user) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Invalid email Address.." });
    }

    if (user.isDeleted) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({
          message: "This action cannot be completed because your account is already deactivated.",
        });
    }
  } catch (err) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Server validation failed" });
  }
  next();
};
