import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import { Checkbox } from '@paljs/ui/Checkbox';
import React, { useContext, useState, useEffect } from 'react';
import { Tabs, Tab } from '@paljs/ui/Tabs';
import { Card, CardBody } from '@paljs/ui/Card';
import low from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';
import styled from 'styled-components';
import { Settings } from 'Components/PrismaAdmin/Settings';
import Select from '@paljs/ui/Select';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import { useRouter } from 'next/router';
import {
  GET_PARENT_OWNER,
  CREATE_PARENT_OWNER,
} from 'Components/PrismaAdmin/SchemaQueries';
import { useQuery, useMutation } from '@apollo/client';
import adminSettings from '../../../../../prisma/adminSettings.json';
import countries from 'settings/countries';
const Input = styled(InputGroup)`
  margin-bottom: 10px;
`;

export const DynamicTableEdit = ({
  modelField,
  currentModelSetting,
  setCurrentModelSetting,
  owner,
  pagesPath,
  db,
}) => {
  let tabs = countries.map((country) => {
    return {
      title: country.country_long,
      code: country.country_short,
    };
  });
  tabs.push({ title: 'id', code: 'id' });

  const fieldBreakPointsMdValue =
    currentModelSetting?.grid?.fieldBreakPoints?.md || 4;

  const fieldBreakPointsMdOnChange = (e) => {
    setCurrentModelSetting({
      ...currentModelSetting,
      grid: {
        ...currentModelSetting?.grid,
        fieldBreakPoints: {
          ...currentModelSetting?.grid?.fieldBreakPoints,
          md: e.target.value,
        },
      },
    });
  };
  const fieldBreakPointsXsValue =
    currentModelSetting?.grid?.fieldBreakPoints?.xs || 4;

  const fieldBreakPointsXsOnChange = (e) => {
    setCurrentModelSetting({
      ...currentModelSetting,
      grid: {
        ...currentModelSetting?.grid,
        fieldBreakPoints: {
          ...currentModelSetting?.grid?.fieldBreakPoints,
          xs: e.target.value,
        },
      },
    });
  };

  const cardBreakPointsMdValue =
    currentModelSetting?.grid?.cardBreakPoints?.md || 4;

  const cardBreakPointsMdOnChange = (e) => {
    setCurrentModelSetting({
      ...currentModelSetting,
      grid: {
        ...currentModelSetting?.grid,
        cardBreakPoints: {
          ...currentModelSetting?.grid?.cardBreakPoints,
          md: e.target.value,
        },
      },
    });
  };

  const cardBreakPointsXsValue =
    currentModelSetting?.grid?.cardBreakPoints?.xs || 4;

  const cardBreakPointsXsOnChange = (e) => {
    setCurrentModelSetting({
      ...currentModelSetting,
      grid: {
        ...currentModelSetting?.grid,
        cardBreakPoints: {
          ...currentModelSetting?.grid?.cardBreakPoints,
          xs: e.target.value,
        },
      },
    });
  };

  const buttonBreakPointsXsValue =
    currentModelSetting?.grid?.buttonBreakPoints?.xs || 4;

  const buttonBreakPointsXsOnChange = (e) => {
    setCurrentModelSetting({
      ...currentModelSetting,
      grid: {
        ...currentModelSetting?.grid,
        buttonBreakPoints: {
          ...currentModelSetting?.grid?.buttonBreakPoints,
          xs: e.target.value,
        },
      },
    });
  };

  const buttonBreakPointsMdValue =
    currentModelSetting?.grid?.buttonBreakPoints?.md || 4;

  const buttonBreakPointsMdOnChange = (e) => {
    setCurrentModelSetting({
      ...currentModelSetting,
      grid: {
        ...currentModelSetting?.grid,
        buttonBreakPoints: {
          ...currentModelSetting?.grid?.buttonBreakPoints,
          md: e.target.value,
        },
      },
    });
  };

  // const onSaveClick,

  return (
    <>
      <Tabs>
        {tabs.map((tab) => {
          // if modelField.id includes "." it means that its a field model. and field model has type
          const createTitleValue = modelField.id.includes('.')
            ? (currentModelSetting?.dynamicTables &&
                currentModelSetting?.dynamicTables[modelField.type] &&
                currentModelSetting?.dynamicTables[modelField.type].header &&
                currentModelSetting?.dynamicTables[modelField.type].header[
                  tab.code
                ]?.createTitle) ||
              `${modelField.id}CreateTitle`
            : (currentModelSetting?.header &&
                currentModelSetting?.header[tab.code]?.createTitle) ||
              `${modelField.id}CreateTitle`;

          const createTitleOnChange = (e) => {
            const createTitleSettingValue = modelField.id.includes('.')
              ? {
                  ...currentModelSetting,

                  dynamicTables: {
                    ...currentModelSetting.dynamicTables,
                    [modelField.type]: {
                      header: {
                        ...currentModelSetting?.header,
                        [tab.code]: {
                          ...(currentModelSetting.header &&
                            currentModelSetting?.header[tab.code]),
                          createTitle: e.target.value,
                        },
                      },
                    },
                  },
                }
              : {
                  ...currentModelSetting,
                  header: {
                    ...currentModelSetting?.header,
                    [tab.code]: {
                      ...(currentModelSetting.header &&
                        currentModelSetting?.header[tab.code]),
                      createTitle: e.target.value,
                    },
                  },
                };
            setCurrentModelSetting(createTitleSettingValue);
          };

          const createDescriptionValue = modelField.id.includes('.')
            ? (currentModelSetting?.dynamicTables &&
                currentModelSetting?.dynamicTables[modelField.type] &&
                currentModelSetting?.dynamicTables[modelField.type].header &&
                currentModelSetting?.dynamicTables[modelField.type].header[
                  tab.code
                ]?.createDescription) ||
              `${modelField.id}CreateDescription`
            : (currentModelSetting?.header &&
                currentModelSetting?.header[tab.code]?.createDescription) ||
              `${modelField.id}CreateDescription`;

          const createDescriptionOnChange = (e) => {
            const createDescriptionSettingValue = modelField.id.includes('.')
              ? {
                  ...currentModelSetting,

                  dynamicTables: {
                    ...currentModelSetting.dynamicTables,
                    [modelField.type]: {
                      header: {
                        ...currentModelSetting?.header,
                        [tab.code]: {
                          ...(currentModelSetting.header &&
                            currentModelSetting?.header[tab.code]),
                          createDescription: e.target.value,
                        },
                      },
                    },
                  },
                }
              : {
                  ...currentModelSetting,
                  header: {
                    ...currentModelSetting?.header,
                    [tab.code]: {
                      ...currentModelSetting?.header[tab.code],
                      createDescription: e.target.value,
                    },
                  },
                };
            setCurrentModelSetting(createDescriptionSettingValue);
          };

          const updateTitleValue = modelField.id.includes('.')
            ? (currentModelSetting?.dynamicTables &&
                currentModelSetting?.dynamicTables[modelField.type] &&
                currentModelSetting?.dynamicTables[modelField.type].header &&
                currentModelSetting?.dynamicTables[modelField.type].header[
                  tab.code
                ]?.updateTitle) ||
              `${modelField.id}UpdateTitle`
            : (currentModelSetting?.header &&
                currentModelSetting?.header[tab.code]?.updateTitle) ||
              `${modelField.id}UpdateTitle`;

          const updateTitleOnChange = (e) => {
            const updateTitleSettingValue = modelField.id.includes('.')
              ? {
                  ...currentModelSetting,

                  dynamicTables: {
                    ...currentModelSetting.dynamicTables,
                    [modelField.type]: {
                      header: {
                        ...currentModelSetting?.header,
                        [tab.code]: {
                          ...(currentModelSetting.header &&
                            currentModelSetting?.header[tab.code]),
                          updateTitle: e.target.value,
                        },
                      },
                    },
                  },
                }
              : {
                  ...currentModelSetting,
                  header: {
                    ...currentModelSetting?.header,
                    [tab.code]: {
                      ...(currentModelSetting.header &&
                        currentModelSetting?.header[tab.code]),
                      updateTitle: e.target.value,
                    },
                  },
                };
            setCurrentModelSetting(updateTitleSettingValue);
          };

          const updateDescriptionValue = modelField.id.includes('.')
            ? (currentModelSetting?.dynamicTables &&
                currentModelSetting?.dynamicTables[modelField.type] &&
                currentModelSetting?.dynamicTables[modelField.type].header &&
                currentModelSetting?.dynamicTables[modelField.type].header[
                  tab.code
                ]?.updateDescription) ||
              `${modelField.id}UpdateDescription`
            : (currentModelSetting?.header &&
                currentModelSetting?.header[tab.code]?.updateDescription) ||
              `${modelField.id}UpdateDescription`;

          const updateDescriptionOnChange = (e) => {
            const updateDescriptionSettingValue = modelField.id.includes('.')
              ? {
                  ...currentModelSetting,

                  dynamicTables: {
                    ...currentModelSetting.dynamicTables,
                    [modelField.type]: {
                      header: {
                        ...currentModelSetting?.header,
                        [tab.code]: {
                          ...(currentModelSetting.header &&
                            currentModelSetting?.header[tab.code]),
                          updateDescription: e.target.value,
                        },
                      },
                    },
                  },
                }
              : {
                  ...currentModelSetting,
                  header: {
                    ...currentModelSetting?.header,
                    [tab.code]: {
                      ...(currentModelSetting.header &&
                        currentModelSetting?.header[tab.code]),
                      updateDescription: e.target.value,
                    },
                  },
                };
            setCurrentModelSetting(updateDescriptionSettingValue);
          };

          const listTitleValue = modelField.id.includes('.')
            ? (currentModelSetting?.dynamicTables &&
                currentModelSetting?.dynamicTables[modelField.type] &&
                currentModelSetting?.dynamicTables[modelField.type].header &&
                currentModelSetting?.dynamicTables[modelField.type].header[
                  tab.code
                ]?.listTitle) ||
              `${modelField.id}ListTitle`
            : (currentModelSetting?.header &&
                currentModelSetting?.header[tab.code]?.listTitle) ||
              `${modelField.id}ListTitle`;

          const listTitleOnChange = (e) => {
            const listTitleSettingValue = modelField.id.includes('.')
              ? {
                  ...currentModelSetting,

                  dynamicTables: {
                    ...currentModelSetting.dynamicTables,
                    [modelField.type]: {
                      header: {
                        ...currentModelSetting?.header,
                        [tab.code]: {
                          ...(currentModelSetting.header &&
                            currentModelSetting?.header[tab.code]),
                          listTitle: e.target.value,
                        },
                      },
                    },
                  },
                }
              : {
                  ...currentModelSetting,
                  header: {
                    ...currentModelSetting?.header,
                    [tab.code]: {
                      ...(currentModelSetting.header &&
                        currentModelSetting?.header[tab.code]),
                      listTitle: e.target.value,
                    },
                  },
                };
            setCurrentModelSetting(listTitleSettingValue);
          };

          const listDescriptionValue = modelField.id.includes('.')
            ? (currentModelSetting?.dynamicTables &&
                currentModelSetting?.dynamicTables[modelField.type] &&
                currentModelSetting?.dynamicTables[modelField.type].header &&
                currentModelSetting?.dynamicTables[modelField.type].header[
                  tab.code
                ]?.listDescription) ||
              `${modelField.id}ListDescription`
            : (currentModelSetting?.header &&
                currentModelSetting?.header[tab.code]?.listDescription) ||
              `${modelField.id}ListDescription`;

          const listDescriptionOnChange = (e) => {
            const listDescriptionSettingValue = modelField.id.includes('.')
              ? {
                  ...currentModelSetting,

                  dynamicTables: {
                    ...currentModelSetting.dynamicTables,
                    [modelField.type]: {
                      header: {
                        ...currentModelSetting?.header,
                        [tab.code]: {
                          ...(currentModelSetting.header &&
                            currentModelSetting?.header[tab.code]),
                          listDescription: e.target.value,
                        },
                      },
                    },
                  },
                }
              : {
                  ...currentModelSetting,
                  header: {
                    ...currentModelSetting?.header,
                    [tab.code]: {
                      ...(currentModelSetting.header &&
                        currentModelSetting?.header[tab.code]),
                      listDescription: e.target.value,
                    },
                  },
                };
            setCurrentModelSetting(listDescriptionSettingValue);
          };

          return (
            <Tab key={tab.code} title={tab.title}>
              {modelField?.create && (
                <>
                  <Input>
                    <input
                      value={createTitleValue}
                      onChange={createTitleOnChange}
                      type="text"
                      placeholder="create title"
                    />
                  </Input>
                  <Input>
                    <input
                      value={createDescriptionValue}
                      onChange={createDescriptionOnChange}
                      type="text"
                      placeholder="create description"
                    />
                  </Input>
                </>
              )}

              <br />
              {modelField.update && (
                <>
                  <Input>
                    <input
                      value={updateTitleValue}
                      onChange={updateTitleOnChange}
                      type="text"
                      placeholder="update title"
                    />
                  </Input>
                  <Input>
                    <input
                      value={updateDescriptionValue}
                      onChange={updateDescriptionOnChange}
                      type="text"
                      placeholder="update description"
                    />
                  </Input>
                </>
              )}
              <br />
              {(modelField.read || !modelField.id.includes('.')) && (
                <>
                  <Input>
                    <input
                      value={listTitleValue}
                      onChange={listTitleOnChange}
                      type="text"
                      placeholder="list title"
                    />
                  </Input>
                  <Input>
                    <input
                      value={listDescriptionValue}
                      onChange={listDescriptionOnChange}
                      type="text"
                      placeholder="list description"
                    />
                  </Input>
                </>
              )}
              <br />
            </Tab>
          );
        })}
      </Tabs>
      <p>Grid</p>
      <Input>
        <input
          value={cardBreakPointsXsValue}
          onChange={cardBreakPointsXsOnChange}
          type="text"
          placeholder="cardBreakPoints xs"
        />
      </Input>
      <Input>
        <input
          value={cardBreakPointsMdValue}
          onChange={cardBreakPointsMdOnChange}
          type="text"
          placeholder="cardBreakPoints md"
        />
      </Input>
      <br />

      <Input>
        <input
          value={fieldBreakPointsXsValue}
          onChange={fieldBreakPointsXsOnChange}
          type="text"
          placeholder="fieldBreakPoints xs"
        />
      </Input>
      <Input>
        <input
          value={fieldBreakPointsMdValue}
          onChange={fieldBreakPointsMdOnChange}
          type="text"
          placeholder="fieldBreakPoints md"
        />
      </Input>
      <br />

      <Input>
        <input
          value={buttonBreakPointsXsValue}
          onChange={buttonBreakPointsXsOnChange}
          type="text"
          placeholder="buttonBreakPoints xs"
        />
      </Input>
      <Input>
        <input
          value={buttonBreakPointsMdValue}
          onChange={buttonBreakPointsMdOnChange}
          type="text"
          placeholder="buttonBreakPoints md"
        />
      </Input>

      <Button
        onClick={() => {
          db.get('models')
            .find({
              id: modelField.id.includes('.')
                ? modelField.id
                : modelField.id.split('.')[0],
            })
            .get('plugins')
            .get('pagesPath')
            .get(owner)
            .get(pagesPath.name)
            .assign(currentModelSetting)
            .write();
        }}
      >
        Save
      </Button>
    </>
  );
};

export const PagesPath = ({
  pageModels,
  currentSettings,
  setCurrentModelSetting,
  currentModelSetting,
  owner,
  pagesPath,
  modelSelect,
  db,
}) => {
  const [newModelTable, setNewModelTable] = useState(null);
  const [pageModelIndex, setPageModelIndex] = useState(0);
  const [formTypeSelect, setFormTypeSelect] = useState([
    {
      label: 'default',
      value: 'default',
    },
    {
      label: 'ecommerce product information',
      value: 'ecommerceProduct',
    },
  ]);
  useEffect(() => {
    setCurrentModelSetting(
      pageModels[pageModelIndex]?.plugins?.pagesPath[owner][pagesPath.name],
    );
  }, [pageModelIndex]);
  return (
    <Card>
      <Tabs
        onSelect={(index) => {
          // const model = pageModels[index];
          // if (model?.plugins?.pagesPath[owner][pagesPath.name]?.self) {
          //   setCurrentModelSetting(model?.plugins?.pagesPath[owner][pagesPath.name]?.self);
          // }
          setPageModelIndex(index);
        }}
      >
        {pageModels.map((pageModel, index) => {
          return (
            <Tab key={index} title={pageModel.id}>
              <Row>
                <Col breakPoint={{ xs: 4 }}>
                  <h6>Current Model</h6>
                  <Card>
                    <CardBody>
                      <p>Settings</p>
                      <DynamicTableEdit
                        owner={owner}
                        pagesPath={pagesPath}
                        db={db}
                        modelField={pageModel}
                        currentModelSetting={currentModelSetting}
                        setCurrentModelSetting={setCurrentModelSetting}
                      />
                    </CardBody>
                  </Card>
                </Col>
                <Col breakPoint={{ xs: 4 }}>
                  <h6>form blocks</h6>
                  <Card>
                    <CardBody>
                      <p>Create block</p>
                      <Input>
                        <input
                          onChange={(e) => {}}
                          type="text"
                          placeholder="title"
                        />
                      </Input>
                      <br />
                      <Input>
                        <input
                          onChange={(e) => {}}
                          type="text"
                          placeholder="description"
                        />
                      </Input>
                      <br />
                      <Select
                        onChange={(options) => {}}
                        options={formTypeSelect}
                        placeholder="block type"
                      />
                      <br />
                      {pageModel.fields.map((field, index) => {
                        return (
                          <span style={{ margin: '15px' }}>
                            <Checkbox status={index} onChange={(value) => {}}>
                              {field.name}
                            </Checkbox>
                          </span>
                        );
                      })}
                    </CardBody>
                  </Card>
                </Col>
                <Col breakPoint={{ xs: 4 }}>
                  <h6>Related Models Table</h6>

                  <Card>
                    <CardBody>
                      <p>Create table</p>
                      <Select
                        onChange={(option) => {
                          const modelField = pageModel.fields.find(
                            (field) =>
                              field.type === option.value &&
                              field.list &&
                              (field.create || field.read || field.update),
                          );
                          setNewModelTable(modelField);
                        }}
                        options={modelSelect}
                        placeholder="Model"
                      />
                      <br />

                      {newModelTable && (
                        <DynamicTableEdit
                          owner={owner}
                          pagesPath={pagesPath}
                          db={db}
                          modelField={newModelTable}
                          currentModelSetting={currentModelSetting}
                          setCurrentModelSetting={setCurrentModelSetting}
                        />
                      )}
                    </CardBody>
                  </Card>
                </Col>
                <Col breakPoint={{ xs: 4 }}></Col>
              </Row>
            </Tab>
          );
        })}
      </Tabs>
    </Card>
  );
};

export default function Login() {
  const [db, setDb] = useState(null);
  const [currentSettings, setCurrentSettings] = useState(null);

  const {
    query: { owner },
  } = useRouter();

  const { data, error, loading, refetch } = useQuery(GET_PARENT_OWNER, {
    variables: {
      owner,
    },
    skip: !owner,
  });

  const [modelSelect, setModelSelect] = useState([]);

  const [currentModelSetting, setCurrentModelSetting] = useState({});

  useEffect(() => {
    if (owner && !db) {
      const adapter = new LocalStorage(owner);
      const db = low(adapter);
      setDb(db);
    }
  }, [owner]);

  useEffect(() => {
    if (db && !currentSettings && data?.parentOwner) {
      const models = db.get('models').value();
      if (!models) {
        db.defaults(data.parentOwner).write();
      }

      const savedDb = db.value();

      setCurrentSettings(savedDb);
      setModelSelect(
        savedDb.models.map((model) => {
          return { label: model.name, value: model.id };
        }),
      );
    }
  }, [db, currentSettings, data]);

  const pagesPaths: any[] = [];
  currentSettings?.models?.map((model, modelInex) => {
    if (model?.plugins?.pagesPath && model?.plugins?.pagesPath[owner]) {
      const modelPagesPaths = model.plugins.pagesPath[owner];
      for (const key in modelPagesPaths) {
        if (Object.prototype.hasOwnProperty.call(modelPagesPaths, key)) {
          const modelPagesPath = modelPagesPaths[key];
          const existPath = pagesPaths.find((pagesPath) => {
            return pagesPath.name === modelPagesPath.name;
          });
          if (!existPath) {
            pagesPaths.push(modelPagesPath);
          }
        }
      }
    }
  });

  if (currentSettings) {
    return (
      <>
        <Tabs>
          <Tab title="Model Permission">
            <Card>
              <Settings role={`prisma/framework/owners/${owner}.json`} />
            </Card>
          </Tab>
          <Tab title="Add New Page Path">
            <AddNewPagesPath
              currentSettings={currentSettings}
              owner={owner}
              modelSelect={modelSelect}
              db={db}
              setCurrentSettings={setCurrentSettings}
            />
          </Tab>
          {pagesPaths?.map((pagesPath, pagesPathIndex) => {
            const pageModels = currentSettings.models.filter(
              (model) =>
                !!model?.plugins?.pagesPath &&
                !!model?.plugins?.pagesPath[owner] &&
                !!model?.plugins?.pagesPath[owner][pagesPath.name],
            );
            return (
              <Tab key={pagesPathIndex} title={pagesPath.name}>
                <PagesPath
                  db={db}
                  modelSelect={modelSelect}
                  pageModels={pageModels}
                  setCurrentModelSetting={setCurrentModelSetting}
                  currentModelSetting={currentModelSetting}
                  owner={owner}
                  pagesPath={pagesPath}
                />
              </Tab>
            );
          })}
        </Tabs>
      </>
    );
  } else {
    return (
      <AddDefaultOwnerModels
        owner={owner}
        refetch={refetch}
        setCurrentSettings={setCurrentSettings}
      />
    );
  }
}

const AddNewPagesPath = ({
  currentSettings,
  setCurrentSettings,
  owner,
  db,
  modelSelect,
}) => {
  const [newPagesPath, setNewPagesPath] = useState({
    options: [],
    name: '',
  });
  return (
    <Card style={{ height: '500px' }}>
      <CardBody>
        <p>Please enter the new name</p>

        <Input>
          <input
            onChange={(e) => {
              setNewPagesPath({
                ...newPagesPath,
                name: e.target.value,
              });
            }}
            type="text"
            placeholder="name"
          />
        </Input>
        <p>Please select at least one model for this page</p>

        <Select
          onChange={(options) => {
            setNewPagesPath({
              ...newPagesPath,
              options,
            });
          }}
          isMulti
          options={modelSelect}
          placeholder="Model"
        />
        <br />
        <Button
          onClick={() => {
            newPagesPath.options.map((option) => {
              const model = currentSettings.models.find(
                (model) => model.id === option.value,
              );
              db.get('models')
                .find({ id: option.value })
                .assign({
                  plugins: {
                    ...model.plugins,
                    pagesPath: {
                      ...model.plugins.pagesPath,
                      [owner]: {
                        ...model.plugins.pagesPath[owner],
                        [newPagesPath.name]: {
                          name: newPagesPath.name,
                        },
                      },
                    },
                  },
                })
                .write();
            });
            setCurrentSettings(null);
          }}
        >
          Confirm
        </Button>
      </CardBody>
    </Card>
  );
};

const AddDefaultOwnerModels = ({ setCurrentSettings, owner, refetch }) => {
  const [defaultOwnerModels, setDefaultOwnerModels] = useState([]);
  const [createParentOwner] = useMutation(CREATE_PARENT_OWNER);
  return (
    <CardBody>
      <p>Please select models that has this owner as their Parent model</p>

      <Select
        onChange={(options) => {
          setDefaultOwnerModels(options);
        }}
        isMulti
        options={adminSettings.models.map((model) => {
          return {
            label: model.name,
            value: model.id,
          };
        })}
        placeholder="Model"
      />
      <br />
      <Button
        onClick={async () => {
          const newParentOwner = await createParentOwner({
            variables: {
              owner,
              models: defaultOwnerModels.map((ownerModel) => ownerModel.value),
            },
          });
          setCurrentSettings(null);
          refetch();
        }}
      >
        Confirm
      </Button>
    </CardBody>
  );
};
