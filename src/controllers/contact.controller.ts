import { Request, Response, NextFunction } from "express";
import {
  create,
  getAll,
  getOne,
  update,
  deleteOne,
} from "../services/mongodb/contact.service";
import {
  createContact,
  getAllContact,
  getOneContact,
  Contact,
  updateContact,
  deleteContact,
} from "../services/mysql/contact.service";
import { success } from "../utils";
import AppError from "../utils/error";
const objectIdRegExp = /^[0-9a-fA-F]{24}$/;
export const createNew = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const mongoResponse = await create(req.body);
    const sqlResponse = await createContact(req.body);
    return success(res, { mongoResponse, sqlResponse }, "Success");
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page, pageSize } = req.query;
  const parsedPage = parseInt(page as string) || 1;
  const parsedPageSize = parseInt(pageSize as string) || 10;
  try {
    const skip = (parsedPage - 1) * parsedPageSize;
    const { contacts, totalCount } = await getAll(skip, parsedPageSize);
    const { contacts: sqlContact, totalCount: sqlTotalCount } =
      await getAllContact(skip, parsedPageSize);
    const mongo_total_pages = Math.ceil(totalCount / parsedPageSize);
    const mongo_current_page = parsedPage;
    const mongo_previous_page =
      mongo_current_page > 1 ? mongo_current_page - 1 : null;
    const mongo_next_page =
      mongo_current_page < mongo_total_pages ? mongo_current_page + 1 : null;
    const sql_total_pages = Math.ceil(sqlTotalCount / parsedPageSize);
    const sql_current_page = parsedPage;
    const sql_previous_page =
      sql_current_page > 1 ? sql_current_page - 1 : null;
    const sql_next_page =
      sql_current_page < sql_total_pages ? sql_current_page + 1 : null;
    return success(
      res,
      {
        mongoResponse: {
          current_page: mongo_current_page,
          total_pages: mongo_total_pages,
          previous_page: mongo_previous_page,
          next_page: mongo_next_page,
          data: contacts,
        },
        sqlResponse: {
          current_page: sql_current_page,
          total_pages: sql_total_pages,
          previous_page: sql_previous_page,
          next_page: sql_next_page,
          data: sqlContact,
        },
      },
      "Success"
    );
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getSingle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    if (objectIdRegExp.test(id)) {
      const response = await getOne(id);
      if (!response) throw new AppError(400, "record not found");
      return success(
        res,
        {
          mongoResponse: response,
          sqlResponse: null,
        },
        "Successfully fetched from mongodb"
      );
    } else {
      const response = await getOneContact(Number(id));
      console.log(response);
      if (!response) throw new AppError(400, "record not found");
      return success(
        res,
        {
          mongoResponse: null,
          sqlResponse: response,
        },
        "Successfully fetched from mysql"
      );
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const updateOne = async (
  req: Request<{ id: string }, {}, Contact, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    if (objectIdRegExp.test(id)) {
      const response = await getOne(id);
      if (!response) throw new AppError(400, "record not found");
      const updated = await update(id, {
        fullname: req.body.fullname,
        email: req.body.email,
      });
      return success(
        res,
        {
          mongoResponse: updated,
          sqlResponse: null,
        },
        "Successfully Updated in mongodb"
      );
    } else {
      const response = await getOneContact(Number(id));
      console.log(response);
      if (!response) throw new AppError(400, "record not found");
      const updated = await updateContact(Number(id), {
        fullname: req.body.fullname,
        email: req.body.email,
      });
      return success(
        res,
        {
          mongoResponse: null,
          sqlResponse: updated,
        },
        "Successfully fetched from mysql"
      );
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const deleteRecord = async (
  req: Request<{ id: string }, {}, Contact, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    if (objectIdRegExp.test(id)) {
      const response = await getOne(id);
      if (!response) throw new AppError(400, "record not found");
      const updated = await deleteOne(id);
      return success(
        res,
        {
          mongoResponse: updated,
          sqlResponse: null,
        },
        "Successfully Deleted in mongodb"
      );
    } else {
      const response = await getOneContact(Number(id));
      console.log(response);
      if (!response) throw new AppError(400, "record not found");
      const updated = await deleteContact(Number(id));
      return success(
        res,
        {
          mongoResponse: null,
          sqlResponse: updated,
        },
        "Successfully Deleted from mysql"
      );
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
