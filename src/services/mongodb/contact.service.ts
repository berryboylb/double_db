import prisma from "../../prisma.mongo";

type Contact = {
  fullname: string;
  email: string;
};

// READ
export const getAll = async (skip?: number, take?: number) => {
  const contacts = await prisma.contact.findMany({
    skip,
    take,
  });
  const totalCount = await prisma.contact.count();
  return { contacts, totalCount };
};

export const getOne = async (id: string) => {
  const contact = await prisma.contact.findUnique({
    where: { id },
  });
  return contact;
};

// CREATE
export const create = async (body: Contact) => {
  const contact = await prisma.contact.create({
    data: {
      ...body,
    },
  });
  return contact;
};

// UPDATE
export const update = async (id: string, body: Contact) => {
  const contact = await prisma.contact.update({
    where: {
      id,
    },
    data: {
      ...body,
    },
  });
  return contact;
};

// HARD DELETE
export const deleteOne = async (id: string) => {
  const contact = await prisma.contact.delete({
    where: {
      id,
    },
  });
  return contact;
};
