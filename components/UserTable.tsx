"use client";
import { Table, Badge, IconButton, Flex } from "@radix-ui/themes";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { IUser } from "@/types/user";
import { formatDate } from "@/lib/utils";

interface UserTableProps {
  users: IUser[];
  onEdit: (user: IUser) => void;
  onDelete: (user: IUser) => void;
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Nombre</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Rol</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Fecha de Creación</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Acciones</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {users.length === 0 ? (
          <Table.Row>
            <Table.Cell
              colSpan={5}
              style={{ textAlign: "center", padding: 48 }}
            >
              No hay usuarios para mostrar
            </Table.Cell>
          </Table.Row>
        ) : (
          users.map((user) => (
            <Table.Row key={user._id}>
              <Table.Cell>
                <Flex direction="column">
                  <span style={{ fontWeight: 500 }}>{user.name}</span>
                </Flex>
              </Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>
                <Badge color={user.role === "admin" ? "purple" : "gray"}>
                  {user.role === "admin" ? "Administrador" : "Usuario"}
                </Badge>
              </Table.Cell>
              <Table.Cell>{formatDate(user.createdAt)}</Table.Cell>
              <Table.Cell>
                <Flex gap="2">
                  <IconButton
                    size="2"
                    variant="soft"
                    color="blue"
                    onClick={() => onEdit(user)}
                  >
                    <Pencil1Icon />
                  </IconButton>
                  <IconButton
                    size="2"
                    variant="soft"
                    color="red"
                    onClick={() => onDelete(user)}
                  >
                    <TrashIcon />
                  </IconButton>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table.Root>
  );
}
