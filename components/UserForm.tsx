"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  Flex,
  Text,
  TextField,
  Button,
  Select,
} from "@radix-ui/themes";
import { IUser } from "@/types/user";

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (user: IUser) => void;
  user?: IUser;
  mode: "create" | "edit";
}

export function UserForm({
  open,
  onOpenChange,
  onSubmit,
  user,
  mode,
}: UserFormProps) {
  const [formData, setFormData] = useState<IUser>({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof IUser, string>>>(
    {}
  );

  useEffect(() => {
    if (user && mode === "edit") {
      setFormData({
        ...user,
        password: "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
      });
    }
    setErrors({});
  }, [user, mode, open]);

  // validar los campos del formulario
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof IUser, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    } else if (formData.name.length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (mode === "create" && !formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // enviar el formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const submitData = { ...formData };
      if (mode === "edit" && !submitData.password) {
        delete submitData.password;
      }
      onSubmit(submitData);
      onOpenChange(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content maxWidth="500px">
        <Dialog.Title>
          {mode === "create" ? "Crear Usuario" : "Editar Usuario"}
        </Dialog.Title>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="4" mt="4">
            <label>
              <Flex direction="column" gap="2">
                <Text size="2" weight="medium">
                  Nombre
                </Text>
                <TextField.Root
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ingresa el nombre"
                />
                {errors.name && (
                  <Text size="1" color="red">
                    {errors.name}
                  </Text>
                )}
              </Flex>
            </label>

            <label>
              <Flex direction="column" gap="2">
                <Text size="2" weight="medium">
                  Email
                </Text>
                <TextField.Root
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="correo@ejemplo.com"
                />
                {errors.email && (
                  <Text size="1" color="red">
                    {errors.email}
                  </Text>
                )}
              </Flex>
            </label>

            <label>
              <Flex direction="column" gap="2">
                <Text size="2" weight="medium">
                  Contraseña{" "}
                  {mode === "edit" && (
                    <Text color="gray">(dejar vacío para no cambiar)</Text>
                  )}
                </Text>
                <TextField.Root
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                />
                {errors.password && (
                  <Text size="1" color="red">
                    {errors.password}
                  </Text>
                )}
              </Flex>
            </label>

            <label>
              <Flex direction="column" gap="2">
                <Text size="2" weight="medium">
                  Rol
                </Text>
                <Select.Root
                  value={formData.role}
                  onValueChange={(value: "admin" | "user") =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <Select.Trigger placeholder="Selecciona un rol" />
                  <Select.Content>
                    <Select.Item value="user">Usuario</Select.Item>
                    <Select.Item value="admin">Administrador</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>
            </label>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button type="button" variant="soft" color="gray">
                  Cancelar
                </Button>
              </Dialog.Close>
              <Button type="submit">
                {mode === "create" ? "Crear" : "Actualizar"}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
