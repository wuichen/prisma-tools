import dynamic from 'next/dynamic';
import React, { useContext } from 'react';
import { TableContext } from 'components/PrismaAdmin/PrismaTable/Context';
import { getDisplayName } from 'components/PrismaAdmin/PrismaTable/Table/utils';
export interface HeaderProps {
  model: string;
  type: 'update' | 'create' | 'list';
  data?: any;
  ui?: any;
  parent?: { name: string; value: any; field: string };
}

const Header: React.FC<HeaderProps> = ({ ui, model, type, data, parent }) => {
  const {
    schema: { models },
    pagesPath,
  } = useContext(TableContext);

  const modelObject = models.find((item) => item.id === model);

  let Title, Description;

  switch (type) {
    case 'update':
      Title = ui?.header?.update?.Title;
      Description = ui?.header?.update?.Description;
      break;
    case 'list':
      Title = ui?.header?.list?.Title;
      Description = ui?.header?.list?.Description;
      break;
    case 'create':
      Title = ui?.header?.create?.Title;
      Description = ui?.header?.create?.Description;
      break;

    default:
      break;
  }

  return (
    <div>
      {type === 'update' && data && modelObject && (
        <>
          {parent ? (
            <h6>{getDisplayName(data, modelObject)}</h6>
          ) : (
            <h4>{getDisplayName(data, modelObject)}</h4>
          )}
        </>
      )}
      {Title && (
        <>
          {parent ? (
            <h6>
              <Title />
            </h6>
          ) : (
            <h4>
              <Title />
            </h4>
          )}
        </>
      )}
      {Description && (
        <>
          <p>
            <Description />
          </p>
        </>
      )}
    </div>
  );
};

export default Header;
