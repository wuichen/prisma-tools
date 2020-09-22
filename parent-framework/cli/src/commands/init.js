const { Command, flags } = require('@oclif/command');
const path = require('path');
const ncp = require('ncp').ncp;
const fs = require('fs');

const cloneSource = () =>
  new Promise(async (resolve, reject) => {
    const codeSource = path.join(
      __dirname,
      '../../../../packages/create/examples/full-stack-nextjs',
    );
    const codeDestination = path.join(__dirname, '../../../example');
    await ncp(codeSource, codeDestination);
    console.log('Cloned full-stack-nextjs');
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
        'provider = "sqlite"',
        'provider = "postgresql"',
      );
      prismaSchemaString = prismaSchemaString + `enum OwnerType {\nUser\n}`;

      fs.writeFileSync(prismaSchemaLocation, prismaSchemaString);
      console.log('Replaced original schema');
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
        '@paljs/cli': '1.5.1',
      };
      fs.writeFileSync(packageJsonLocation, JSON.stringify(packageJson));
      console.log('Edited package.json');

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
      console.log('Cloned Prisma Admin');
      resolve();
    }, 500);
  });

const addCustomElements = () => {
  new Promise((resolve, reject) => {
    setTimeout(async () => {
      const headerElementSource = path.join(__dirname, '../components/Header');
      const headerElementDestination = path.join(
        __dirname,
        '../../../example/src/Components/Header',
      );
      await ncp(headerElementSource, headerElementDestination);
      console.log('Cloned Header component');

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

      if (formString.includes('interface FormProps {')) {
        const newFormPropsInterface = 'interface FormProps {' + '\n ui?: any;';
        formString = formString.replace(
          'interface FormProps {',
          newFormPropsInterface,
        );
        console.log('form props interface and edited');
      } else {
        console.log('Cant find form props interface');
      }

      // Add props
      if (formString.includes('const Form: React.FC<FormProps> = ({')) {
        const newFormProps = 'const Form: React.FC<FormProps> = ({' + '\n ui,';
        formString = formString.replace(
          'const Form: React.FC<FormProps> = ({',
          newFormProps,
        );
        console.log('form props and edited');
      } else {
        console.log('Cant find form props');
      }

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
        console.log('table props interface and edited');
      } else {
        console.log('Cant find table props interface');
      }

      // Add props
      if (tableString.includes('const Table: React.FC<TableProps> = ({')) {
        const newTableProps =
          'const Table: React.FC<TableProps> = ({' + '\n ui,';
        tableString = tableString.replace(
          'const Table: React.FC<TableProps> = ({',
          newTableProps,
        );
        console.log('table props and edited');
      } else {
        console.log('Cant find table props');
      }

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
        console.log('editRecord props interface and edited');
      } else {
        console.log('Cant find editRecord props interface');
      }

      // Add props
      if (
        editRecordString.includes(
          'const EditRecord: React.FC<EditRecordProps> = ({',
        )
      ) {
        const newEditRecordProps =
          'const EditRecord: React.FC<EditRecordProps> = ({' + '\n ui,';
        editRecordString = editRecordString.replace(
          'const EditRecord: React.FC<EditRecordProps> = ({',
          newEditRecordProps,
        );
        console.log('editRecord props and edited');
      } else {
        console.log('Cant find editRecord props');
      }

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
        console.log('Found create form and edited');
      } else {
        console.log('Cant find create form');
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
        console.log('Found update form and edited');
      } else {
        console.log('Cant find update form');
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
        console.log('Found list table and edited');
      } else {
        console.log('Cant find list table');
      }

      // Add props interface

      if (dynamicTableString.includes('interface DynamicTableProps {')) {
        const newDynamicTablePropsInterface =
          'interface DynamicTableProps {' +
          '\n ui?: any; \n inModal?: boolean;';
        dynamicTableString = dynamicTableString.replace(
          'interface DynamicTableProps {',
          newDynamicTablePropsInterface,
        );
        console.log('dynamic table props interface and edited');
      } else {
        console.log('Cant find dynamic table props interface');
      }

      // Add props
      if (
        dynamicTableString.includes(
          'const DynamicTable: React.FC<DynamicTableProps> = ({',
        )
      ) {
        const newDynamicTableProps =
          'const DynamicTable: React.FC<DynamicTableProps> = ({' +
          '\n ui,inModal,';
        dynamicTableString = dynamicTableString.replace(
          'const DynamicTable: React.FC<DynamicTableProps> = ({',
          newDynamicTableProps,
        );
        console.log('dynamic table props and edited');
      } else {
        console.log('Cant find dynamic table props');
      }

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
