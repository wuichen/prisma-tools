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
const Input = styled(InputGroup)`
  margin-bottom: 10px;
`;

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
      pageModels[pageModelIndex]?.uiPlugins?.pagesPath[owner][pagesPath.name]
        ?.self,
    );
  }, [pageModelIndex]);
  console.log(currentModelSetting);
  return (
    <Card>
      <Tabs
        onSelect={(index) => {
          // const model = pageModels[index];
          // if (model?.uiPlugins?.pagesPath[owner][pagesPath.name]?.self) {
          //   setCurrentModelSetting(model?.uiPlugins?.pagesPath[owner][pagesPath.name]?.self);
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
                      <Input>
                        <input
                          value={
                            currentModelSetting?.header?.createTitle ||
                            `${pageModel.id}CreateTitle`
                          }
                          onChange={(e) => {
                            setCurrentModelSetting({
                              ...currentModelSetting,
                              header: {
                                ...currentModelSetting?.header,
                                createTitle: e.target.value,
                              },
                            });
                          }}
                          type="text"
                          placeholder="create title"
                        />
                      </Input>
                      <Input>
                        <input
                          value={
                            currentModelSetting?.header?.createDescription ||
                            `${pageModel.id}CreateDescription`
                          }
                          onChange={(e) => {
                            setCurrentModelSetting({
                              ...currentModelSetting,
                              header: {
                                ...currentModelSetting?.header,
                                createDescription: e.target.value,
                              },
                            });
                          }}
                          type="text"
                          placeholder="create description"
                        />
                      </Input>

                      <br />
                      <Input>
                        <input
                          value={
                            currentModelSetting?.header?.updateTitle ||
                            `${pageModel.id}UpdateTitle`
                          }
                          onChange={(e) => {
                            setCurrentModelSetting({
                              ...currentModelSetting,
                              header: {
                                ...currentModelSetting?.header,
                                updateTitle: e.target.value,
                              },
                            });
                          }}
                          type="text"
                          placeholder="update title"
                        />
                      </Input>
                      <Input>
                        <input
                          value={
                            currentModelSetting?.header?.updateDescription ||
                            `${pageModel.id}UpdateDescription`
                          }
                          onChange={(e) => {
                            setCurrentModelSetting({
                              ...currentModelSetting,
                              header: {
                                ...currentModelSetting?.header,
                                updateDescription: e.target.value,
                              },
                            });
                          }}
                          type="text"
                          placeholder="update description"
                        />
                      </Input>
                      <br />
                      <Input>
                        <input
                          value={
                            currentModelSetting?.header?.listTitle ||
                            `${pageModel.id}ListTitle`
                          }
                          onChange={(e) => {
                            setCurrentModelSetting({
                              ...currentModelSetting,
                              header: {
                                ...currentModelSetting?.header,
                                listTitle: e.target.value,
                              },
                            });
                          }}
                          type="text"
                          placeholder="list title"
                        />
                      </Input>
                      <Input>
                        <input
                          value={
                            currentModelSetting?.header?.listDescription ||
                            `${pageModel.id}ListDescription`
                          }
                          onChange={(e) => {
                            setCurrentModelSetting({
                              ...currentModelSetting,
                              header: {
                                ...currentModelSetting?.header,
                                listDescription: e.target.value,
                              },
                            });
                          }}
                          type="text"
                          placeholder="list description"
                        />
                      </Input>
                      <br />
                      <p>Grid</p>
                      <Input>
                        <input
                          value={
                            currentModelSetting?.grid?.cardBreakPoints?.xs || 4
                          }
                          onChange={(e) => {
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
                          }}
                          type="number"
                          placeholder="cardBreakPoints xs"
                        />
                      </Input>
                      <Input>
                        <input
                          value={
                            currentModelSetting?.grid?.cardBreakPoints?.md || 4
                          }
                          onChange={(e) => {
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
                          }}
                          type="number"
                          placeholder="cardBreakPoints md"
                        />
                      </Input>
                      <br />

                      <Input>
                        <input
                          value={
                            currentModelSetting?.grid?.fieldBreakPoints?.xs || 4
                          }
                          onChange={(e) => {
                            setCurrentModelSetting({
                              ...currentModelSetting,
                              grid: {
                                ...currentModelSetting?.grid,
                                fieldBreakPoints: {
                                  ...currentModelSetting?.grid
                                    ?.fieldBreakPoints,
                                  xs: e.target.value,
                                },
                              },
                            });
                          }}
                          type="number"
                          placeholder="fieldBreakPoints xs"
                        />
                      </Input>
                      <Input>
                        <input
                          value={
                            currentModelSetting?.grid?.fieldBreakPoints?.md || 4
                          }
                          onChange={(e) => {
                            setCurrentModelSetting({
                              ...currentModelSetting,
                              grid: {
                                ...currentModelSetting?.grid,
                                fieldBreakPoints: {
                                  ...currentModelSetting?.grid
                                    ?.fieldBreakPoints,
                                  md: e.target.value,
                                },
                              },
                            });
                          }}
                          type="number"
                          placeholder="fieldBreakPoints md"
                        />
                      </Input>
                      <br />

                      <Input>
                        <input
                          value={
                            currentModelSetting?.grid?.buttonBreakPoints?.xs ||
                            4
                          }
                          onChange={(e) => {
                            setCurrentModelSetting({
                              ...currentModelSetting,
                              grid: {
                                ...currentModelSetting?.grid,
                                buttonBreakPoints: {
                                  ...currentModelSetting?.grid
                                    ?.buttonBreakPoints,
                                  xs: e.target.value,
                                },
                              },
                            });
                          }}
                          type="number"
                          placeholder="buttonBreakPoints xs"
                        />
                      </Input>
                      <Input>
                        <input
                          value={
                            currentModelSetting?.grid?.buttonBreakPoints?.md ||
                            4
                          }
                          onChange={(e) => {
                            setCurrentModelSetting({
                              ...currentModelSetting,
                              grid: {
                                ...currentModelSetting?.grid,
                                buttonBreakPoints: {
                                  ...currentModelSetting?.grid
                                    ?.buttonBreakPoints,
                                  md: e.target.value,
                                },
                              },
                            });
                          }}
                          type="number"
                          placeholder="buttonBreakPoints md"
                        />
                      </Input>
                      <Button
                        onClick={() => {
                          db.get('models')
                            .find({ id: pageModel.id })
                            .get('uiPlugins')
                            .get('pagesPath')
                            .get(owner)
                            .get(pagesPath.name)
                            .assign({
                              self: currentModelSetting,
                            })
                            .write();
                        }}
                      >
                        Save
                      </Button>
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
                        onChange={(option) => {}}
                        options={modelSelect}
                        placeholder="Model"
                      />
                      <br />

                      <Input>
                        <input
                          onChange={(e) => {}}
                          type="text"
                          placeholder="create title"
                        />
                      </Input>
                      <Input>
                        <input
                          onChange={(e) => {}}
                          type="text"
                          placeholder="create description"
                        />
                      </Input>

                      <br />
                      <Input>
                        <input
                          onChange={(e) => {}}
                          type="text"
                          placeholder="update title"
                        />
                      </Input>
                      <Input>
                        <input
                          onChange={(e) => {}}
                          type="text"
                          placeholder="update description"
                        />
                      </Input>
                      <br />
                      <Input>
                        <input
                          onChange={(e) => {}}
                          type="text"
                          placeholder="list title"
                        />
                      </Input>
                      <Input>
                        <input
                          onChange={(e) => {}}
                          type="text"
                          placeholder="list description"
                        />
                      </Input>
                      <br />
                      <p>Grid</p>
                      <Input>
                        <input
                          onChange={(e) => {}}
                          type="text"
                          placeholder="cardBreakPoints xs"
                        />
                      </Input>
                      <Input>
                        <input
                          onChange={(e) => {}}
                          type="text"
                          placeholder="cardBreakPoints md"
                        />
                      </Input>
                      <br />

                      <Input>
                        <input
                          onChange={(e) => {}}
                          type="text"
                          placeholder="fieldBreakPoints xs"
                        />
                      </Input>
                      <Input>
                        <input
                          onChange={(e) => {}}
                          type="text"
                          placeholder="fieldBreakPoints md"
                        />
                      </Input>
                      <br />

                      <Input>
                        <input
                          onChange={(e) => {}}
                          type="text"
                          placeholder="buttonBreakPoints xs"
                        />
                      </Input>
                      <Input>
                        <input
                          onChange={(e) => {}}
                          type="text"
                          placeholder="buttonBreakPoints md"
                        />
                      </Input>
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
    if (model?.uiPlugins?.pagesPath && model?.uiPlugins?.pagesPath[owner]) {
      const modelPagesPaths = model.uiPlugins.pagesPath[owner];
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
              owner={owner}
              modelSelect={modelSelect}
              db={db}
              setCurrentSettings={setCurrentSettings}
            />
          </Tab>
          {pagesPaths?.map((pagesPath, pagesPathIndex) => {
            const pageModels = currentSettings.models.filter(
              (model) =>
                !!model?.uiPlugins?.pagesPath &&
                !!model?.uiPlugins?.pagesPath[owner] &&
                !!model?.uiPlugins?.pagesPath[owner][pagesPath.name],
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

const AddNewPagesPath = ({ setCurrentSettings, owner, db, modelSelect }) => {
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
              db.get('models')
                .find({ id: option.value })
                .assign({
                  uiPlugins: {
                    pagesPath: {
                      [owner]: {
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
