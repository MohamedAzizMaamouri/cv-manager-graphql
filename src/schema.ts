import { gql } from "graphql-tag";

export const typeDefs = gql`
  # Enum
  enum Role {
    USER
    ADMIN
  }

  # Types
  type User {
    id: ID!
    name: String!
    email: String!
    role: Role!
  }

  type Skill {
    id: ID!
    designation: String!
  }

  type Cv {
    id: ID!
    name: String!
    age: Int!
    job: String!
    user: User!          # resolver de relation
    skills: [Skill!]!    # resolver de relation
  }

  # Enum pour les subscriptions
  enum CvChangeType {
    ADDED
    UPDATED
    DELETED
  }

  type CvChangeEvent {
    type: CvChangeType!
    cv: Cv
  }

  # Inputs
  input CreateCvInput {
    name: String!
    age: Int!
    job: String!
    ownerId: ID!
    skillIds: [ID!]!
  }

  input UpdateCvInput {
    name: String
    age: Int
    job: String
    ownerId: ID
    skillIds: [ID!]
  }

  # Operations
  type Query {
    cvs: [Cv!]!
    cv(id: ID!): Cv
  }

  type Mutation {
    createCv(input: CreateCvInput!): Cv!
    updateCv(id: ID!, input: UpdateCvInput!): Cv!
    deleteCv(id: ID!): Boolean!
  }

  type Subscription {
    cvChanged: CvChangeEvent!
  }
`;