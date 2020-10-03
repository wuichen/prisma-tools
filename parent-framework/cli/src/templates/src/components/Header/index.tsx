import dynamic from 'next/dynamic';
import React, { useContext } from 'react';
import { TableContext } from 'Components/PrismaAdmin/PrismaTable/Context';
import { getDisplayName } from 'Components/PrismaAdmin/PrismaTable/Table/utils';
import { FormattedMessage } from 'react-intl';

export interface HeaderProps {
  model: string;
  action: 'update' | 'create' | 'list' | 'view';
  data?: any;
  ui?: any;
  parent?: { name: string; value: any; field: string };
}

const Header: React.FC<HeaderProps> = ({ ui, model, action, data, parent }) => {
  const {
    schema: { models },
    pagesPath,
  } = useContext(TableContext);
  const breadCrumbs = pagesPath.split('/');
  const modelObject = models.find((item) => item.id === model);

  let titleId, titlePlaceholder, descriptionId, descriptionPlaceholder;

  // createTitle
  // createDescription
  // updateTitle
  // updateDescription
  // listTitle
  // listDescription

  switch (action) {
    case 'update':
      if (parent) {
        titleId = `Admin.${breadCrumbs[2]}.${breadCrumbs[3]}.${parent.name}.form.${modelObject?.id}updateTitle`;
        titlePlaceholder = ui?.header?.updateTitle;
        descriptionId = `Admin.${breadCrumbs[2]}.${breadCrumbs[3]}.${parent.name}.form.${modelObject?.id}updateDescription`;
        descriptionPlaceholder = ui?.header?.updateDescription;
      }
      titleId = `Admin.${breadCrumbs[2]}.${breadCrumbs[3]}.${modelObject?.id}updateTitle`;
      titlePlaceholder = ui?.header?.updateTitle;
      descriptionId = `Admin.${breadCrumbs[2]}.${breadCrumbs[3]}.${modelObject?.id}updateDescription`;
      descriptionPlaceholder = ui?.header?.updateDescription;
      break;
    case 'list':
      if (parent) {
        titleId = `Admin.${breadCrumbs[2]}.${breadCrumbs[3]}.${parent.name}.dynamicTable.${modelObject?.id}updateTitle`;
        titlePlaceholder = ui?.header?.updateTitle;
        descriptionId = `Admin.${breadCrumbs[2]}.${breadCrumbs[3]}.${parent.name}.dynamicTable.${modelObject?.id}updateDescription`;
        descriptionPlaceholder = ui?.header?.updateDescription;
      }
      titleId = `Admin.${breadCrumbs[2]}.${breadCrumbs[3]}.${modelObject?.id}listTitle`;
      titlePlaceholder = ui?.header?.listTitle;
      descriptionId = `Admin.${breadCrumbs[2]}.${breadCrumbs[3]}.${modelObject?.id}listDescription`;
      descriptionPlaceholder = ui?.header?.listDescription;
      break;
    case 'create':
      if (parent) {
        titleId = `Admin.${breadCrumbs[2]}.${breadCrumbs[3]}.${parent.name}.form.${modelObject?.id}updateTitle`;
        titlePlaceholder = ui?.header?.updateTitle;
        descriptionId = `Admin.${breadCrumbs[2]}.${breadCrumbs[3]}.${parent.name}.form.${modelObject?.id}updateDescription`;
        descriptionPlaceholder = ui?.header?.updateDescription;
      }
      titleId = `Admin.${breadCrumbs[2]}.${breadCrumbs[3]}.${modelObject?.id}createTitle`;
      titlePlaceholder = ui?.header?.createTitle;
      descriptionId = `Admin.${breadCrumbs[2]}.${breadCrumbs[3]}.${modelObject?.id}createDescription`;
      descriptionPlaceholder = ui?.header?.createDescription;
      break;

    default:
      break;
  }

  return (
    <div>
      <h4>
        <FormattedMessage id={titleId} defaultMessage={titlePlaceholder} />
      </h4>
      <br />
      <h6>
        <FormattedMessage
          id={descriptionId}
          defaultMessage={descriptionPlaceholder}
        />
      </h6>

      {(action === 'update' || action === 'view') && data && modelObject && (
        <>
          {parent ? (
            <h6>{getDisplayName(data, modelObject)}</h6>
          ) : (
            <h4>{getDisplayName(data, modelObject)}</h4>
          )}
        </>
      )}
    </div>
  );
};

export default Header;
