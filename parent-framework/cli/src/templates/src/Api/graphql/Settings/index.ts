import { extendType, stringArg, objectType, enumType, inputObjectType } from '@nexus/schema'
import low from 'lowdb'
import RoleSchemaAdapter from './adapter/roleSchema'
import fs from 'fs'
import path from 'path'
import adminSettings from '../../../../prisma/adminSettings'
import { GraphQLJSON } from 'graphql-type-json'
export const SchemaQueries = extendType({
  type: 'Query',
  definition(t) {
    t.field('getSchema', {
      type: 'Schema',
      args: {
        role: stringArg({ nullable: false }),
      },
      resolve: async (_parent, { role }, { prisma }) => {
        const adapter = new RoleSchemaAdapter({ prisma, role })
        const db = await low(adapter)
        console.log(JSON.stringify(db.value()))
        return db.value()
      },
    })
    t.field('parentOwner', {
      type: GraphQLJSON,
      args: {
        owner: stringArg({ nullable: false }),
      },
      resolve: async (_, { owner }, {}) => {
        const rootPath = 'prisma/framework/root.json'

        const ownerPath = `prisma/framework/owners/${owner}.json`
        const ownerPathExists = fs.existsSync(ownerPath)
        const rootFile = fs.readFileSync(rootPath)
        const rootJson = JSON.parse(rootFile)

        if (!ownerPathExists) {
          throw new Error('Owner not exist')
        }
        const ownerFile = fs.readFileSync(ownerPath)
        const ownerFileJson = JSON.parse(ownerFile)

        // check if owner file has extra permissions comparing to root
        const updateOwnerFileModels = ownerFileJson.models.map((model) => {
          const rootModel = rootJson.models.find((rootModel) => rootModel.name === model.name)
          const fields = model.fields.map((modelField) => {
            const rootModelField = rootModel.fields.find((rootModelField) => rootModelField.name === modelField.name)
            return {
              ...modelField,
              create: rootModelField.create === false ? rootModelField.create : modelField.create,
              update: rootModelField.update === false ? rootModelField.update : modelField.update,
              read: rootModelField.read === false ? rootModelField.read : modelField.read,
            }
          })
          return {
            ...model,
            fields,
            create: rootModel.create === false ? rootModel.create : model.create,
            update: rootModel.update === false ? rootModel.update : model.update,
            delete: rootModel.delete === false ? rootModel.delete : model.delete,
          }
        })
        const updateOwnerJson = { ...ownerFileJson, models: updateOwnerFileModels }
        const updatedOwnerFile = fs.writeFileSync(ownerPath, JSON.stringify(updateOwnerJson, null, 2))
        return updateOwnerJson
      },
    })
    t.field('parentRoot', {
      type: GraphQLJSON,
      args: {},
      resolve: async (_, {}, {}) => {
        const frameworkPath = 'prisma/framework'
        const frameworkPathExists = fs.existsSync(frameworkPath)
        const ownerType = adminSettings.enums.find((enumModel) => enumModel.name === 'OwnerType')

        if (!ownerType || !ownerType?.fields || ownerType?.fields?.length === 0) {
          throw new Error('Please declare the owner types of this schema')
        }

        if (!frameworkPathExists) {
          fs.mkdirSync(frameworkPath)

          const updatedModels = adminSettings.models.map((model) => {
            const stripeFields = model.fields.filter((field) => field.name.startsWith('stripe'))
            const slugField = model.fields.find((field) => field.name === 'slug')
            const imageField = model.fields.find((field) => field.name === 'image')
            const titleField = model.fields.find((field) => field.name === 'title')
            const nameField = model.fields.find((field) => field.name === 'name')
            const activeField = model.fields.find((field) => field.name === 'name')

            let hooks = {
              before: {
                create: [],
                update: [],
              },
              after: {
                create: [],
                update: [],
              },
            }
            const displayFields = []
            const serverPlugins = {
              hooks,
              active: {},
              slug: '',
              type: 'public', // 'public' || 'private' || 'system'
            }
            if (imageField) {
              displayFields.push(imageField.name)
            }
            if (titleField) {
              displayFields.push(titleField.name)
            }
            if (nameField) {
              displayFields.push(nameField.name)
            }
            if (slugField && (titleField || nameField)) {
              serverPlugins.slug = titleField?.name || nameField?.name
            }
            if (activeField) {
              serverPlugins.active = {}
            }
            return {
              ...model,
              displayFields,
              serverPlugins,
            }
            // if (stripeFields.length > 0) {
            //   stripeFields.map((stripeField) => {

            //     // stripe fields are usually like stripe_product_id
            //     const splitField = stripeFields.split('_')

            //     switch (splitField[1]) {
            //       case 'product':
            //         hooks.after.create.push({
            //           function: 'syncStripe',
            //           parmas: {
            //             model: 'product',
            //             type: 'create',
            //             data: {
            //               name: 'data.title',
            //               description: 'data.description',
            //               active: 'data.active',
            //               images: ['data.image'],
            //               metadata: {
            //                 productId: 'data.id',
            //                 companyId: 'data.company.id'
            //               }
            //             }
            //           }
            //         })
            //         hooks.after.update.push({
            //           function: 'syncStripe',
            //           parmas: {
            //             model: 'product',
            //             type: 'create',
            //             data: {
            //               name: 'data.title',
            //               images: ['data.image'],
            //               description: 'data.description',
            //               active: 'data.active'
            //             }
            //           }
            //         })
            //         break;
            //       case 'price':
            //         hooks.after.create.push({
            //           function: 'syncStripe',
            //           parmas: {
            //             model: 'price',
            //             type: 'create',
            //             data: {
            //               nickname: 'data.title',
            //               active: 'data.active',
            //               unit_amount: 'data.company.country.multiplier * data.price'
            //               currency: 'data.company.country.currency'
            //             }
            //           }
            //         })
            //         break;

            //       default:
            //         break;
            //     }

            //   })
            // }
          })

          fs.writeFileSync(
            frameworkPath + '/root.json',
            JSON.stringify({ ...adminSettings, models: updatedModels }, null, 2),
          )
          // fs.mkdirSync(frameworkPath + '/owners')
          // ownerType.fields.map((field) => {
          //   fs.writeFileSync(frameworkPath + `/owners/${field}.json`, JSON.stringify(adminSettings, null, 2))
          // })
        }

        const rootFile = fs.readFileSync(frameworkPath + '/root.json')
        const rootJson = JSON.parse(rootFile)

        return rootJson
      },
    })
  },
})

export const SchemaMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createParentOwner', {
      type: GraphQLJSON,
      args: {
        owner: stringArg({ nullable: false }),
        models: stringArg({ list: true }),
      },
      resolve: async (_, { owner, models }, {}) => {
        const rootPath = 'prisma/framework/root.json'
        const rootPathExists = fs.existsSync(rootPath)

        if (!rootPathExists) {
          throw new Error('Please initialize the framework first')
        }

        const ownersDirectoryPath = 'prisma/framework/owners'
        if (!fs.existsSync(ownersDirectoryPath)) {
          fs.mkdirSync('prisma/framework/owners')
        }

        const ownerPath = `prisma/framework/owners/${owner}.json`
        const rootFile = fs.readFileSync(rootPath)
        let rootJson = JSON.parse(rootFile)

        rootJson.models = rootJson.models.filter((model) => {
          return models.includes(model.id)
        })

        const ownerFile = fs.writeFileSync(ownerPath, JSON.stringify(rootJson, null, 2))
        return rootJson
      },
    })
    t.field('updateModel', {
      type: 'Model',
      args: {
        id: stringArg({ nullable: false }),
        data: 'UpdateModelInput',
        role: stringArg({ nullable: false }),
      },
      resolve: async (_, { id, data, role }, { prisma }) => {
        const adapter = new RoleSchemaAdapter({ prisma, role })
        const db = await low(adapter)
        return db.get('models').find({ id }).assign(data).write()
      },
    })
    t.field('updateField', {
      type: 'Field',
      args: {
        id: stringArg({ nullable: false }),
        modelId: stringArg({ nullable: false }),
        data: 'UpdateFieldInput',
        role: stringArg({ nullable: false }),
      },
      resolve: async (_, { id, modelId, data, role }, { prisma }) => {
        const adapter = new RoleSchemaAdapter({ prisma, role })
        const db = await low(adapter)
        return db.get('models').find({ id: modelId }).get('fields').find({ id }).assign(data).write()
      },
    })
  },
})
export const EnumObject = objectType({
  name: 'Enum',
  definition(t) {
    t.string('name')
    t.list.string('fields')
  },
})
export const SchemaObject = objectType({
  name: 'Schema',
  definition(t) {
    t.list.field('models', { type: 'Model' })
    t.list.field('enums', { type: 'Enum' })
  },
})
export const ModelObject = objectType({
  name: 'Model',
  definition(t) {
    t.string('id')
    t.string('name')
    t.string('idField')
    t.list.string('displayFields')
    t.boolean('create')
    t.boolean('update')
    t.boolean('delete')
    t.list.field('fields', {
      type: 'Field',
    })
    t.string('custom', { nullable: true })
    t.string('parent', { nullable: true })
  },
})
export const FieldObject = objectType({
  name: 'Field',
  definition(t) {
    t.string('id')
    t.string('name')
    t.string('title')
    t.string('type')
    t.boolean('list')
    t.boolean('required')
    t.boolean('isId')
    t.boolean('unique')
    t.boolean('create')
    t.boolean('update')
    t.boolean('read')
    t.boolean('filter')
    t.boolean('sort')
    t.boolean('upload')
    t.boolean('gallery', { nullable: true })
    t.boolean('image', { nullable: true })
    t.boolean('form', { nullable: true })
    t.boolean('editor')
    t.boolean('relationField', { nullable: true })
    t.int('order')
    t.field('kind', { type: 'KindEnum' })
  },
})
export const KindEnum = enumType({
  name: 'KindEnum',
  members: ['object', 'enum', 'scalar'],
})
export const UpdateModelInput = inputObjectType({
  name: 'UpdateModelInput',
  definition(t) {
    t.string('name')
    t.string('idField')
    t.list.string('displayFields')
    t.boolean('create')
    t.boolean('update')
    t.boolean('delete')
    t.list.field('fields', {
      type: 'UpdateFieldInput',
    })
  },
})
export const UpdateFieldInput = inputObjectType({
  name: 'UpdateFieldInput',
  definition(t) {
    t.string('id')
    t.string('name')
    t.string('title')
    t.string('type')
    t.boolean('list')
    t.boolean('required')
    t.boolean('isId')
    t.boolean('unique')
    t.boolean('create')
    t.boolean('update')
    t.boolean('read')
    t.boolean('filter')
    t.boolean('sort')
    t.boolean('editor')
    t.boolean('upload')
    t.boolean('relationField', { nullable: true })
    t.int('order')
    t.field('kind', { type: 'KindEnum' })
  },
})
