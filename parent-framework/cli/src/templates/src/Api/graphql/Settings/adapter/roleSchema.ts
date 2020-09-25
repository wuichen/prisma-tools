import Base from './base'
import fs from 'fs'
// Same code as in FileAsync, minus `await`
class RoleSchema extends Base {
  read() {
    if (this.source.role.includes('framework')) {
      const schemaExists = fs.existsSync(this.source.role)
      if (!schemaExists) {
        throw new Error('Framework file doesnt exist')
      }
      const schemaBuffer = fs.readFileSync(this.source.role)
      const schemaJson = JSON.parse(schemaBuffer)
      return schemaJson
    }
    return this.source.prisma.role
      .findOne({
        where: {
          title: this.source.role,
        },
      })
      .then((data) => {
        return data.schema
      })
  }

  write(data) {
    if (this.source.role.includes('framework')) {
      const schemaExists = fs.existsSync(this.source.role)
      if (!schemaExists) {
        throw new Error('Framework file doesnt exist')
      }
      const updateSchema = fs.writeFileSync(this.source.role, JSON.stringify(data, null, 2))
      const schemaBuffer = fs.readFileSync(this.source.role)
      const schemaJson = JSON.parse(schemaBuffer)

      return schemaJson
    }
    return this.source.prisma.role
      .update({
        where: { title: this.source.role },
        data: {
          schema: data,
        },
      })
      .then((data) => {
        return data.schema
      })
  }
}
export default RoleSchema
