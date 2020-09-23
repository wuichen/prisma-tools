const { Command, flags } = require('@oclif/command');
const path = require('path');
const ncp = require('ncp').ncp;
const fs = require('fs');
const chalk = require('chalk');

const { format, Options: PrettierOptions } = require('prettier');

const cloneSource = () =>
  new Promise(async (resolve, reject) => {
    const codeSource = path.join(
      __dirname,
      '../../../../packages/create/examples/full-stack-nextjs',
    );
    const codeDestination = path.join(__dirname, '../../../example');
    await ncp(codeSource, codeDestination);
    console.log(chalk.green('Successfully cloned full-stack-nextjs'));
    resolve();
  });

const updatePrismaSchema = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const prismaSchemaLocation = path.join(
        __dirname,
        '../../../example/prisma/schema.prisma',
      );
      const prismaSchema = fs.readFileSync(prismaSchemaLocation);
      let prismaSchemaString = prismaSchema.toString();
      prismaSchemaString = prismaSchemaString.replace(
        'model User {',
        'model User {\ncompanies Company[]\nmembers   Member[]',
      );
      prismaSchemaString = prismaSchemaString.replace(
        'provider = "sqlite"',
        'provider = "postgresql"',
      );
      prismaSchemaString =
        prismaSchemaString +
        `enum OwnerType {\nUser\n} 
      model Company {
        id      Int      @default(autoincrement()) @id
        title   String
        slug    String   @unique
        owner   User     @relation(fields: [ownerId], references: [id])
        ownerId Int
        members Member[]
      }
      
      model Member {
        id        Int     @default(autoincrement()) @id
        company   Company @relation(fields: [companyId], references: [id])
        companyId Int
        user      User    @relation(fields: [userId], references: [id])
        userId    Int
        role      Role    @relation(fields: [roleId], references: [id])
        roleId    Int
      }
      
      model Role {
        id      Int      @default(autoincrement()) @id
        schema  Json
        title   String   @unique
        members Member[]
      }
      `;

      fs.writeFileSync(prismaSchemaLocation, prismaSchemaString);
      console.log(chalk.green('Successfully replaced original schema'));
      resolve();
    }, 500);
  });

const updatePackageJson = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const packageJsonLocation = path.join(
        __dirname,
        '../../../example/package.json',
      );
      let packageJson = require(packageJsonLocation);
      packageJson.scripts = {
        ...packageJson.scripts,
        generate:
          'yarn generate:prisma && npx pal g && yarn generate:nexus && yarn codegen',
      };
      packageJson.dependencies = {
        ...packageJson.dependencies,
        '@paljs/cli': '^1.5.1',
        'jwt-decode': '^3.0.0',
      };
      fs.writeFileSync(
        packageJsonLocation,
        JSON.stringify(packageJson, null, 2),
      );

      console.log(chalk.green('Successfully edited package.json'));
      resolve();
    }, 500);
  });

const updatePalConfig = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const palJsConfigLocation = path.join(
        __dirname,
        '../../../example/pal.js',
      );
      const overridePalJsConfig = `
      const pageContent = \`
      import React from 'react';
      import PrismaTable from 'components/PrismaAdmin';
      const #{id}: React.FC = () => {
        return <PrismaTable model="#{id}" />;
      };
      export default #{id};
      \`;

      module.exports = {
        backend: {
          generator: 'nexus-schema',
          onDelete: true,
          output: 'src/Api/graphql',
          excludeQueriesAndMutations: ['aggregate'],
        },
        frontend: {
          admin: {
            pageContent
          },
        },
      };
      `;
      overridePalJsConfig = format(overridePalJsConfig, {
        singleQuote: true,
        semi: false,
        trailingComma: 'all',
        parser: 'babel-ts',
      });
      fs.writeFileSync(palJsConfigLocation, overridePalJsConfig);
      resolve();
    }, 500);
  });

const clonePrismaAdmin = () =>
  new Promise((resolve, reject) => {
    setTimeout(async () => {
      const adminSource = path.join(
        __dirname,
        '../../../../packages/admin/src',
      );
      const adminDestination = path.join(
        __dirname,
        '../../../example/src/Components/PrismaAdmin',
      );
      await ncp(adminSource, adminDestination);
      console.log(
        chalk.green(
          'Successfully cloned PrismaAdmin to Components/PrismaAdmin',
        ),
      );
      resolve();
    }, 500);
  });

const updateSchemaQueries = () =>
  new Promise((resolve, reject) => {
    setTimeout(async () => {
      const schemQueriesLocation = path.join(
        __dirname,
        '../../../example/src/Components/PrismaAdmin/SchemaQueries.ts',
      );
      const schemQueriesBuffer = fs.readFileSync(schemQueriesLocation);
      let schemQueriesString = schemQueriesBuffer.toString();

      const oldQuery = 'query getSchema {';
      if (schemQueriesString.includes(oldQuery)) {
        const newQuery = 'query getSchema($title: String!) {';
        schemQueriesString = schemQueriesString.replace(oldQuery, newQuery);
        console.log(
          chalk.green(
            'Successfully updated query getSchema Components/PrismaAdmin/SchemaQueries.ts',
          ),
        );
      } else {
        console.log(
          chalk.red(
            'Failed to updated query getSchema Components/PrismaAdmin/SchemaQueries.ts',
          ),
        );
      }

      const oldString = 'getSchema {';
      if (schemQueriesString.includes(oldString)) {
        const newString = 'getSchema(title: $title) {';
        schemQueriesString = schemQueriesString.replace(oldString, newString);
        console.log(
          chalk.green(
            'Successfully updated query name getSchema Components/PrismaAdmin/SchemaQueries.ts',
          ),
        );
      } else {
        console.log(
          chalk.red(
            'Failed to updated query name getSchema Components/PrismaAdmin/SchemaQueries.ts',
          ),
        );
      }

      schemQueriesString = format(schemQueriesString, {
        singleQuote: true,
        semi: false,
        trailingComma: 'all',
        parser: 'babel-ts',
      });
      fs.writeFileSync(schemQueriesLocation, schemQueriesString);

      resolve();
    }, 500);
  });

const updateSettings = () =>
  new Promise((resolve, reject) => {
    setTimeout(async () => {
      const settingsLocation = path.join(
        __dirname,
        '../../../example/src/Components/PrismaAdmin/Settings/index.tsx',
      );
      const settingsBuffer = fs.readFileSync(settingsLocation);
      let settingsString = settingsBuffer.toString();

      const oldString = 'export const Settings: React.FC = () => {';
      if (settingsString.includes(oldString)) {
        const newString =
          `import { useRole } from 'utils/middleware';\n` +
          oldString +
          `const role = useRole();
            const { data } = useQuery<{ getSchema: ContextProps['schema'] }>(GET_SCHEMA, {
              variables: {
                title: role,
              },
              skip: !role,
            });`;
        settingsString = settingsString.replace(oldString, newString);
        console.log(
          chalk.green(
            'Successfully updated Components/PrismaAdmin/Settings/index.tsx',
          ),
        );
      } else {
        console.log(
          chalk.red(
            'Failed to updated Components/PrismaAdmin/Settings/index.tsx',
          ),
        );
      }

      settingsString = format(settingsString, {
        singleQuote: true,
        semi: false,
        trailingComma: 'all',
        parser: 'babel-ts',
      });
      fs.writeFileSync(settingsLocation, settingsString);

      resolve();
    }, 500);
  });

const addCustomElements = () => {
  new Promise((resolve, reject) => {
    setTimeout(async () => {
      const headerElementSource = path.join(
        __dirname,
        '../templates/components/Header',
      );
      const headerElementDestination = path.join(
        __dirname,
        '../../../example/src/Components/Header',
      );
      await ncp(headerElementSource, headerElementDestination);
      console.log(
        chalk.green('Successfully cloned Header to src/Components/Header'),
      );

      const utilsSource = path.join(__dirname, '../templates/utils');
      const utilsDestination = path.join(
        __dirname,
        '../../../example/src/utils',
      );
      await ncp(utilsSource, utilsDestination);
      console.log(chalk.green('Successfully cloned utils to src/utils'));

      resolve();
    }, 500);
  });
};

const updatePrismaAdminForm = () =>
  new Promise((resolve, reject) => {
    setTimeout(async () => {
      const formLocation = path.join(
        __dirname,
        '../../../example/src/Components/PrismaAdmin/PrismaTable/Form/index.tsx',
      );
      const formBuffer = fs.readFileSync(formLocation);
      let formString = formBuffer.toString();

      // Add props interface
      const oldFormPropsInterface = 'interface FormProps {';
      if (formString.includes(oldFormPropsInterface)) {
        const newFormPropsInterface = oldFormPropsInterface + '\n ui?: any;';
        formString = formString.replace(
          oldFormPropsInterface,
          newFormPropsInterface,
        );
        console.log(
          chalk.green(
            'Successfully updated interface FormProps in src/Components/PrismaAdmin/PrismaTable/Table/Form/index.tsx',
          ),
        );
      } else {
        console.log(
          chalk.red(
            'Failed to update interface FormProps in src/Components/PrismaAdmin/PrismaTable/Table/Form/index.tsx',
          ),
        );
      }

      // Add props
      const oldFormProps = 'const Form: React.FC<FormProps> = ({';
      if (formString.includes(oldFormProps)) {
        const newFormProps = oldFormProps + '\n ui,';
        formString = formString.replace(oldFormProps, newFormProps);
        console.log(
          chalk.green(
            'Successfully updated FormProps in src/Components/PrismaAdmin/PrismaTable/Table/Form/index.tsx',
          ),
        );
      } else {
        console.log(
          chalk.red(
            'Failed to update FormProps in src/Components/PrismaAdmin/PrismaTable/Table/Form/index.tsx',
          ),
        );
      }
      // Update Wrapper Card Start to div
      const wrapperCardStartMatch = formString.match(/<Card\b((?:[^<>])*)>/g);
      if (wrapperCardStartMatch && wrapperCardStartMatch.length > 0) {
        const newWrapperCardStart =
          "<div style={action === 'create' ? { maxWidth: '1200px', maxHeight: '100vh', minWidth: '50vw' } : {}}>";
        formString = formString.replace(
          wrapperCardStartMatch[0],
          newWrapperCardStart,
        );
        console.log(
          chalk.green(
            'Successfully updated Card Wrapper in src/Components/PrismaAdmin/PrismaTable/Table/Form/index.tsx',
          ),
        );
      } else {
        console.log(
          chalk.red(
            'Failed to update Card Wrapper in src/Components/PrismaAdmin/PrismaTable/Table/Form/index.tsx',
          ),
        );
      }
      // Update Wrapper Card End to div
      if (formString.includes('</Card>')) {
        const newWrapperCardEnd = '</div>';
        formString = formString.replace('</Card>', newWrapperCardEnd);
        console.log('Found wraper card end  and edited');
      } else {
        console.log('Cant find wraper card end');
      }

      // Update CardFooter to div
      const oldCardFooterStart = '<CardFooter';
      if (formString.includes(oldCardFooterStart)) {
        const newCardFooterStart = '<div';
        formString = formString.replace(oldCardFooterStart, newCardFooterStart);
        console.log(
          chalk.green(
            'Successfully updated CardFooter Start in src/Components/PrismaAdmin/PrismaTable/Table/Form/index.tsx',
          ),
        );
      } else {
        console.log(
          chalk.red(
            'Failed to update CardFooter Start in src/Components/PrismaAdmin/PrismaTable/Table/Form/index.tsx',
          ),
        );
      }

      // Update CardFooter to div
      const oldCardFooterEnd = '</CardFooter>';
      if (formString.includes(oldCardFooterEnd)) {
        const newCardFooterEnd = '</div>';
        formString = formString.replace(oldCardFooterEnd, newCardFooterEnd);

        console.log(
          chalk.green(
            'Successfully updated CardFooter End in src/Components/PrismaAdmin/PrismaTable/Table/Form/index.tsx',
          ),
        );
      } else {
        console.log(
          chalk.red(
            'Failed to update CardFooter End in src/Components/PrismaAdmin/PrismaTable/Table/Form/index.tsx',
          ),
        );
      }

      // Update CardBody to div
      if (formString.includes('<CardBody')) {
        const newCardBodyStart = '<div';
        formString = formString.replace('<CardBody', newCardBodyStart);
        console.log(
          chalk.green(
            'Successfully updated CardBody Start in src/Components/PrismaAdmin/PrismaTable/Table/Form/index.tsx',
          ),
        );
      } else {
        console.log(
          chalk.red(
            'Failed to update CardBody Start in src/Components/PrismaAdmin/PrismaTable/Table/Form/index.tsx',
          ),
        );
      }

      // Update CardBody to div
      const oldCardBodyEnd = '</CardBody>';
      if (formString.includes(oldCardBodyEnd)) {
        const newCardBodyEnd = '</div>';
        formString = formString.replace(oldCardBodyEnd, newCardBodyEnd);
        console.log(
          chalk.green(
            'Successfully updated CardBody End in src/Components/PrismaAdmin/PrismaTable/Table/Form/index.tsx',
          ),
        );
      } else {
        console.log(
          chalk.red(
            'Failed to update CardBody End in src/Components/PrismaAdmin/PrismaTable/Table/Form/index.tsx',
          ),
        );
      }

      // Update Row to use form field cards
      const oldRowStart = '<Row between="lg">';
      if (formString.includes(oldRowStart)) {
        const newRowStart = `{ui?.forms.map((form, index) => {
          const modelFields = model.fields.filter(
            (field) =>
              ((action !== 'view' && field[action]) ||
                (['update', 'view'].includes(action) && (field.read || field.update))) &&
              !field.list &&
              !field.relationField,
          );
          if (modelFields?.length > 0) {
            return (
              <>
                <h6>{form.title}</h6>

                <Card key={index}>
                  <CardBody><Row between="lg">`;
        formString = formString.replace(oldRowStart, newRowStart);
        console.log(
          chalk.green(
            'Successfully updated Row Start in src/Components/PrismaAdmin/PrismaTable/Table/Form/index.tsx',
          ),
        );
      } else {
        console.log(
          chalk.red(
            'Failed to update Row Start in src/Components/PrismaAdmin/PrismaTable/Table/Form/index.tsx',
          ),
        );
      }

      // Update Row to use form field cards
      const oldRowEnd = '</Row>';
      if (formString.includes(oldRowEnd)) {
        const newRowEnd = `</Row>
                </CardBody>
              </Card>
            </>
          );
        } else {
          return null;
        }
        })}`;
        formString = formString.replace(oldRowEnd, newRowEnd);
        console.log(
          chalk.green(
            'Successfully updated Row End in src/Components/PrismaAdmin/PrismaTable/Table/Form/index.tsx',
          ),
        );
      } else {
        console.log(
          chalk.red(
            'Failed to update Row End in src/Components/PrismaAdmin/PrismaTable/Table/Form/index.tsx',
          ),
        );
      }

      formString = format(formString, {
        singleQuote: true,
        semi: false,
        trailingComma: 'all',
        parser: 'babel-ts',
      });
      fs.writeFileSync(formLocation, formString);

      resolve();
    }, 500);
  });

const updatePrismaAdminTable = () =>
  new Promise((resolve, reject) => {
    setTimeout(async () => {
      const tableLocation = path.join(
        __dirname,
        '../../../example/src/Components/PrismaAdmin/PrismaTable/Table/index.tsx',
      );
      const tableBuffer = fs.readFileSync(tableLocation);
      let tableString = tableBuffer.toString();

      // Add props interface

      if (tableString.includes('interface TableProps {')) {
        const newTablePropsInterface =
          'interface TableProps {' + '\n ui?: any;';
        tableString = tableString.replace(
          'interface TableProps {',
          newTablePropsInterface,
        );
        console.log(
          chalk.green(
            'Successfully updated interface TableProps in src/Components/PrismaAdmin/PrismaTable/Table/index.tsx',
          ),
        );
      } else {
        console.log(
          chalk.green(
            'Failed to update interface TableProps in src/Components/PrismaAdmin/PrismaTable/Table/index.tsx',
          ),
        );
      }

      // Add props
      const oldTableProps = 'const Table: React.FC<TableProps> = ({';
      if (tableString.includes(oldTableProps)) {
        const newTableProps = oldTableProps + '\n ui,';
        tableString = tableString.replace(oldTableProps, newTableProps);

        console.log(
          chalk.green(
            'Successfully updated TableProps in src/Components/PrismaAdmin/PrismaTable/Table/index.tsx',
          ),
        );
      } else {
        console.log(
          chalk.green(
            'Failed to update TableProps in src/Components/PrismaAdmin/PrismaTable/Table/index.tsx',
          ),
        );
      }
      tableString = format(tableString, {
        singleQuote: true,
        semi: false,
        trailingComma: 'all',
        parser: 'babel-ts',
      });

      fs.writeFileSync(tableLocation, tableString);

      resolve();
    }, 500);
  });

const updatePrismaAdminEditRecord = () =>
  new Promise((resolve, reject) => {
    setTimeout(async () => {
      const editRecordLocation = path.join(
        __dirname,
        '../../../example/src/Components/PrismaAdmin/PrismaTable/EditRecord.tsx',
      );
      const editRecordBuffer = fs.readFileSync(editRecordLocation);
      let editRecordString = editRecordBuffer.toString();

      // Add props interface

      if (editRecordString.includes('interface EditRecordProps {')) {
        const newEditRecordPropsInterface =
          'interface EditRecordProps {' + '\n ui?: any;';
        editRecordString = editRecordString.replace(
          'interface EditRecordProps {',
          newEditRecordPropsInterface,
        );

        console.log(
          chalk.green(
            'Successfully updated interface EditRecordProps in src/Components/PrismaAdmin/PrismaTable/EditRecord.tsx',
          ),
        );
      } else {
        console.log(
          chalk.red(
            'Failed to updated interface EditRecordProps in src/Components/PrismaAdmin/PrismaTable/EditRecord.tsx',
          ),
        );
      }

      // Add props
      const oldEditRecordPropsString =
        'const EditRecord: React.FC<EditRecordProps> = ({';
      if (editRecordString.includes(oldEditRecordPropsString)) {
        const newEditRecordPropsString = oldEditRecordPropsString + '\n ui,';
        editRecordString = editRecordString.replace(
          oldEditRecordPropsString,
          newEditRecordPropsString,
        );
        console.log(
          chalk.green(
            'Successfully updated EditRecordProps in src/Components/PrismaAdmin/PrismaTable/EditRecord.tsx',
          ),
        );
      } else {
        console.log(
          chalk.red(
            'Failed to updated EditRecordProps in src/Components/PrismaAdmin/PrismaTable/EditRecord.tsx',
          ),
        );
      }
      editRecordString = format(editRecordString, {
        singleQuote: true,
        semi: false,
        trailingComma: 'all',
        parser: 'babel-ts',
      });

      fs.writeFileSync(editRecordLocation, editRecordString);

      resolve();
    }, 500);
  });

const updatePrismaAdminDynamicTable = () =>
  new Promise((resolve, reject) => {
    setTimeout(async () => {
      const dynamicTableLocation = path.join(
        __dirname,
        '../../../example/src/Components/PrismaAdmin/PrismaTable/dynamicTable.tsx',
      );
      const dynamicTableBuffer = fs.readFileSync(dynamicTableLocation);
      let dynamicTableString = dynamicTableBuffer.toString();
      dynamicTableString =
        'import Header from "Components/Header";\n' + dynamicTableString;

      // Edit Form in Modal
      const createFormMatch = dynamicTableString.match(/<Form((?:[^<])*)\/>/g);
      if (createFormMatch && createFormMatch.length > 0) {
        const newCreateForm =
          '<><Header parent={parent} ui={ui} data={record} model={model} type="create" />' +
          createFormMatch[0] +
          '</>';
        dynamicTableString = dynamicTableString.replace(
          createFormMatch[0],
          newCreateForm,
        );
        console.log(
          chalk.green(
            'Successfully added Header before Create Form in src/Components/PrismaAdmin/PrismaTable/dynamicTable.tsx',
          ),
        );
      } else {
        console.log(
          chalk.red(
            'Failed to add Header before Create Form in src/Components/PrismaAdmin/PrismaTable/dynamicTable.tsx',
          ),
        );
      }

      // Edit EditRecord
      const updateFormMatch = dynamicTableString.match(
        /<EditRecord((?:[^<])*)\/>/g,
      );
      if (updateFormMatch && updateFormMatch.length > 0) {
        const newUpdateForm =
          '<><Header parent={parent} ui={ui} data={record} model={model} type="update" />' +
          updateFormMatch[0] +
          '</>';
        dynamicTableString = dynamicTableString.replace(
          updateFormMatch[0],
          newUpdateForm,
        );

        console.log(
          chalk.green(
            'Successfully added Header before EditRecord in src/Components/PrismaAdmin/PrismaTable/dynamicTable.tsx',
          ),
        );
      } else {
        console.log(
          chalk.red(
            'Failed to add Header before EditRecord in src/Components/PrismaAdmin/PrismaTable/dynamicTable.tsx',
          ),
        );
      }

      // Edit Table
      const listTableMatch = dynamicTableString.match(/<Table((?:[^<])*)\/>/g);
      if (listTableMatch && listTableMatch.length > 0) {
        const newListTable =
          '<><Header parent={parent} ui={ui} data={record} model={model} type="list" />' +
          listTableMatch[0] +
          '</>';
        dynamicTableString = dynamicTableString.replace(
          listTableMatch[0],
          newListTable,
        );

        console.log(
          chalk.green(
            'Successfully added Header before Table in src/Components/PrismaAdmin/PrismaTable/dynamicTable.tsx',
          ),
        );
      } else {
        console.log(
          chalk.green(
            'Failed to add Header before Table in src/Components/PrismaAdmin/PrismaTable/dynamicTable.tsx',
          ),
        );
      }

      // Add props interface
      const oldPropsInterfaceString = 'interface DynamicTableProps {';
      if (dynamicTableString.includes(oldPropsInterfaceString)) {
        const newPropsInterfaceString =
          oldPropsInterfaceString + '\n ui?: any; \n inModal?: boolean;';
        dynamicTableString = dynamicTableString.replace(
          oldPropsInterfaceString,
          newPropsInterfaceString,
        );
        console.log(
          chalk.green(
            'Successfully updated interface DynamicTableProps in src/Components/PrismaAdmin/PrismaTable/dynamicTable.tsx',
          ),
        );
      } else {
        console.log(
          chalk.red(
            'Failed to update interface DynamicTableProps in src/Components/PrismaAdmin/PrismaTable/dynamicTable.tsx',
          ),
        );
      }

      // Add props
      const oldDynamicTablePropsString =
        'const DynamicTable: React.FC<DynamicTableProps> = ({';
      if (dynamicTableString.includes(oldDynamicTablePropsString)) {
        const newDynamicTablePropsString =
          oldDynamicTablePropsString + '\n ui,inModal,';
        dynamicTableString = dynamicTableString.replace(
          oldDynamicTablePropsString,
          newDynamicTablePropsString,
        );
        console.log(
          chalk.green(
            'Successfully updated DynamicTableProps in src/Components/PrismaAdmin/PrismaTable/dynamicTable.tsx',
          ),
        );
      } else {
        console.log(
          chalk.red(
            'Failed to update DynamicTableProps in src/Components/PrismaAdmin/PrismaTable/dynamicTable.tsx',
          ),
        );
      }

      dynamicTableString = format(dynamicTableString, {
        singleQuote: true,
        semi: false,
        trailingComma: 'all',
        parser: 'babel-ts',
      });

      fs.writeFileSync(dynamicTableLocation, dynamicTableString);
      resolve();
    }, 500);
  });

class Init extends Command {
  async run() {
    await cloneSource();
    await updatePrismaSchema();
    await updatePackageJson();
    await clonePrismaAdmin();
    await updatePrismaAdminDynamicTable();
    await updatePrismaAdminForm();
    await updatePrismaAdminTable();
    await updatePrismaAdminEditRecord();
    await addCustomElements();
    await updateSettings();
    await updateSchemaQueries();
  }
}

Init.description = `Describe the command here
...
Extra documentation goes here
`;

Init.flags = {
  name: flags.string({ char: 'n', description: 'name to print' }),
};

module.exports = Init;
