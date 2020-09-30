import gql from 'graphql-tag';

const fieldFragment = gql`
  fragment Field on Field {
    id
    name
    title
    type
    list
    kind
    read
    required
    isId
    unique
    create
    order
    update
    sort
    filter
    editor
    upload
    relationField
    plugins
  }
`;

const modelFragment = gql`
  fragment Model on Model {
    id
    name
    create
    delete
    update
    idField
    displayFields
    plugins
    fields {
      ...Field
    }
  }
  ${fieldFragment}
`;

export const GET_SCHEMA = gql`
  query getSchema($role: String!) {
    getSchema(role: $role) {
      models {
        ...Model
      }
      enums {
        name
        fields
      }
    }
  }
  ${modelFragment}
`;

export const UPDATE_MODEL = gql`
  mutation updateModel($id: String!, $data: UpdateModelInput!, $role: String!) {
    updateModel(id: $id, data: $data, role: $role) {
      ...Model
    }
  }
  ${modelFragment}
`;

export const UPDATE_FIELD = gql`
  mutation updateField(
    $id: String!
    $modelId: String!
    $data: UpdateFieldInput!
    $role: String!
  ) {
    updateField(id: $id, modelId: $modelId, data: $data, role: $role) {
      ...Field
    }
  }
  ${fieldFragment}
`;

export const GET_PARENT_ROOT = gql`
  query parentRoot {
    parentRoot
  }
`;

export const GET_PARENT_OWNER = gql`
  query parentOwner($owner: String!) {
    parentOwner(owner: $owner)
  }
`;

export const CREATE_PARENT_OWNER = gql`
  mutation createParentOwner($owner: String!, $models: [String!]!) {
    createParentOwner(owner: $owner, models: $models)
  }
`;

export const CREATE_PARENT_ROOT = gql`
  mutation createParentRoot {
    createParentRoot
  }
`;

export const GENERATE_PARENT_OWNER_PAGES = gql`
  mutation generateParentOwnerPages($owner: String!) {
    generateParentOwnerPages(owner: $owner)
  }
`;
