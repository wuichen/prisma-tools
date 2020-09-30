export default (schema?: boolean) => `
#{import}

${
  schema
    ? `
#{exportTs}const #{Model}FindManyQuery = queryField${staticData};
#{exportJs}
`
    : `
schema.extendType({
  type: 'Query',
  definition(t) {
    t.field${staticData};
  },
});
`
}
`;

const staticData = `('findMany#{Model}', {
  type: '#{Model}',
  nullable: true,
  list: true,
  args: {
    where: '#{Model}WhereInput',
    orderBy: #{schema}arg({ type: '#{Model}OrderByInput', list: true }),
    cursor: '#{Model}WhereUniqueInput',
    distinct: '#{Model}DistinctFieldEnum',
    skip: 'Int',
    take: 'Int',
  },
  resolve(_parent, args, {prisma, select}) {
    return prisma.#{model}.findMany({
      ...args,
      ...select,
    })#{as}
  },
})`;
