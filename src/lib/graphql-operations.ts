import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation Login($loginUserInput: LoginUserInput!) {
    login(loginUserInput: $loginUserInput) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation Register($registerUserInput: RegisterUserInput!) {
    register(registerUserInput: $registerUserInput) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query GetMe {
    me {
      id
      name
      email
    }
  }
`;

export const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      title
      description
      completed
      createdAt
      updatedAt
    }
  }
`;

export const GET_TODO = gql`
  query GetTodo($id: Int!) {
    todo(id: $id) {
      id
      title
      description
      completed
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_TODO = gql`
  mutation CreateTodo($createTodoInput: CreateTodoInput!) {
    createTodo(createTodoInput: $createTodoInput) {
      id
      title
      description
      completed
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation UpdateTodo($updateTodoInput: UpdateTodoInput!) {
    updateTodo(updateTodoInput: $updateTodoInput) {
      id
      title
      description
      completed
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: Int!) {
    removeTodo(id: $id) {
      id
    }
  }
`;
