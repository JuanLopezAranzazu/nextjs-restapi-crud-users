"use client";

import { useState, useEffect } from "react";
import { Box, Flex, Heading, Text, Button, Callout } from "@radix-ui/themes";
import { PlusIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { UserTable } from "@/components/UserTable";
import { UserForm } from "@/components/UserForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Pagination } from "@/components/Pagination";
import { IUser } from "@/types/user";
import { getUsers, createUser, updateUser, deleteUser } from "@/lib/api";

export default function Home() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<IUser | undefined>();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
  const itemsPerPage = 5;

  // obtener usuarios con paginación
  const loadUsers = async (page = 1) => {
    try {
      setLoading(true);
      setLoadError(null);
      const response = await getUsers(page, itemsPerPage);
      if (response.error) {
        setLoadError(response.error);
      } else {
        setUsers(response.users || []);
        setTotalPages(response.totalPages || 1);
        setTotalUsers(response.total || 0);
        setCurrentPage(page);
      }
    } catch (error) {
      setLoadError("Error cargando usuarios");
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(currentPage);
  }, [currentPage]);

  const handleCreate = () => {
    setFormMode("create");
    setSelectedUser(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (user: IUser) => {
    setFormMode("edit");
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (user: IUser) => {
    setUserToDelete(user);
    setIsConfirmOpen(true);
  };

  // eliminar usuario
  const handleDeleteConfirm = async () => {
    try {
      if (!userToDelete?._id) return;
      setOperationError(null);
      const response = await deleteUser(userToDelete._id);
      if (response?.error) {
        setOperationError(response.error);
      } else {
        await loadUsers(currentPage);
        setUserToDelete(null);
        setIsConfirmOpen(false);
      }
    } catch (error) {
      setOperationError("Error eliminando usuario");
      console.error("Error eliminando usuario:", error);
    }
  };

  // guardar los datos del formulario
  const handleFormSubmit = async (user: IUser) => {
    try {
      setOperationError(null);
      let response;
      if (formMode === "create") {
        response = await createUser(user);
      } else if (selectedUser?._id) {
        response = await updateUser(selectedUser._id, user);
      }

      if (response?.error) {
        setOperationError(response.error);
      } else {
        await loadUsers(currentPage);
        setIsFormOpen(false);
      }
    } catch (error) {
      setOperationError("Error guardando usuario");
      console.error("Error guardando usuario:", error);
    }
  };

  const handlePageChange = (page: number) => {
    loadUsers(page);
  };

  return (
    <Box style={{ minHeight: "100vh" }} p="6">
      <Box style={{ maxWidth: 1280, margin: "0 auto" }}>
        <Flex
          direction={{ initial: "column", sm: "row" }}
          justify="between"
          align="center"
          mb="6"
          gap="4"
        >
          <Heading size="5">Gestión de Usuarios</Heading>
          <Button size="2" onClick={handleCreate}>
            <PlusIcon />
            Nuevo Usuario
          </Button>
        </Flex>

        {loadError && (
          <Callout.Root color="red" mb="4">
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>{loadError}</Callout.Text>
          </Callout.Root>
        )}

        {operationError && (
          <Callout.Root color="red" mb="4">
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>{operationError}</Callout.Text>
          </Callout.Root>
        )}

        {loading ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            gap="4"
            style={{ minHeight: 300 }}
          >
            <Box
              style={{
                width: 40,
                height: 40,
                border: "3px solid var(--gray-5)",
                borderTopColor: "var(--accent-9)",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <Text color="gray">Cargando usuarios...</Text>
          </Flex>
        ) : (
          <>
            <UserTable
              users={users}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalUsers}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        <UserForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleFormSubmit}
          user={selectedUser}
          mode={formMode}
        />

        <ConfirmDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          onConfirm={handleDeleteConfirm}
          title="Eliminar Usuario"
          description={`¿Estás seguro de que deseas eliminar al usuario "${userToDelete?.name}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          variant="danger"
        />
      </Box>
    </Box>
  );
}
