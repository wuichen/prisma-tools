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
import Link from 'next/link';
import {
  GET_PARENT_OWNER,
  CREATE_PARENT_OWNER,
  UPDATE_MODEL,
} from 'Components/PrismaAdmin/SchemaQueries';
import { useQuery, useMutation } from '@apollo/client';
// import adminSettings from '../../../../../prisma/adminSettings.json';
import root from '../../../../../prisma/framework/root.json';
import countries from 'settings/countries';
const Input = styled(InputGroup)`
  margin-bottom: 10px;
`;

export const FormBlockEdit = ({
  refetch,
  currentSettings,
  setCurrentSettings,
  owner,
  pagesPath,
  modelField,
}) => {
  const tabs = countries.map((country) => {
    return {
      title: country.country_long,
      code: country.country_short,
    };
  });
  const [updateModel] = useMutation(UPDATE_MODEL);
  tabs.push({ title: 'id', code: 'id' });
  const model = modelField.id.includes('.')
    ? currentSettings?.models.find(
        (model) => model.id === modelField.id.split('.')[0],
      )
    : currentSettings?.models.find((model) => model.id === modelField.id);

  const modelPagesPath = model?.plugins?.pagesPath[pagesPath.name];

  const formTypeSelect = [
    {
      label: 'default',
      value: 'default',
    },
    {
      label: 'ecommerce product information',
      value: 'ecommerceProduct',
    },
  ];

  let header = {
    id: {
      title: `${owner}${pagesPath.name}${modelField.id}Title`,
      description: `${owner}${pagesPath.name}${modelField.id}Description`,
    },
  };
  countries.map((country) => {
    if (country?.country_short) {
      header[country.country_short] = {
        title: `${country.country_short}${owner}${pagesPath.name}${modelField.id}Title`,
        description: `${country.country_short}${owner}${pagesPath.name}${modelField.id}Description`,
      };
    }
  });
  const newForm = {
    header,
    type: 'default',
    fields: {},
  };
  const [currentForm, setCurrentForm] = useState(null);
  let forms = modelField.id.includes('.')
    ? modelPagesPath?.dynamicTables[modelField.type]?.forms
    : modelPagesPath?.forms;
  const formsSelect = [
    {
      label: 'new',
      value: 'new',
    },
  ];
  for (const key in forms) {
    if (Object.prototype.hasOwnProperty.call(forms, key)) {
      const form = forms[key];
      formsSelect.push({
        label: form.header.id.title,
        value: form.header.id.title,
      });
    }
  }
  console.log(modelField);
  if (model) {
    return (
      <>
        <h6>form blocks</h6>
        <Select
          onChange={(option) => {
            if (option.value === 'new') {
              setCurrentForm(newForm);
            } else {
              console.log(forms[option.value]);
              setCurrentForm(forms[option.value]);
            }
          }}
          options={formsSelect}
        />
        {currentForm && (
          <Card>
            <CardBody>
              <p>form block</p>
              <Button
                onClick={async () => {
                  let newModelPageForm = JSON.parse(
                    JSON.stringify(modelPagesPath),
                  );
                  if (modelField.id.includes('.')) {
                    delete newModelPageForm?.dynamicTables[modelField.type]
                      ?.forms[currentForm.header.id.title];
                  } else {
                    delete newModelPageForm?.forms[currentForm.header.id.title];
                  }

                  let data = JSON.parse(JSON.stringify(model));
                  delete data.id;
                  setCurrentForm(null);

                  await updateModel({
                    variables: {
                      role: `prisma/framework/owners/${owner}.json`,
                      id: model.id,
                      data: {
                        ...data,
                        plugins: {
                          ...data.plugins,
                          pagesPath: {
                            ...data.plugins.pagesPath,
                            [pagesPath.name]: newModelPageForm,
                          },
                        },
                      },
                    },
                  });

                  refetch();
                }}
              >
                Delete
              </Button>
              <Tabs>
                {tabs.map((tab) => {
                  const formTitleValue = currentForm?.header[tab.code]?.title;

                  const formTitleOnChange = (e) => {
                    setCurrentForm({
                      ...currentForm,
                      header: {
                        ...currentForm.header,
                        [tab.code]: {
                          ...currentForm.header[tab.code],
                          title: e.target.value,
                        },
                      },
                    });
                  };

                  const formDescriptionValue =
                    currentForm?.header[tab.code]?.description;

                  const formDescriptionOnChange = (e) => {
                    setCurrentForm({
                      ...currentForm,
                      header: {
                        ...currentForm.header,
                        [tab.code]: {
                          ...currentForm.header[tab.code],
                          description: e.target.value,
                        },
                      },
                    });
                  };

                  return (
                    <Tab key={tab.code} title={tab.title}>
                      <p>Form Title</p>
                      <Input>
                        <input
                          onChange={formTitleOnChange}
                          value={formTitleValue}
                          type="text"
                          placeholder="title"
                        />
                      </Input>
                      <br />
                      <p>Form Description</p>
                      <Input>
                        <input
                          onChange={formDescriptionOnChange}
                          value={formDescriptionValue}
                          type="text"
                          placeholder="description"
                        />
                      </Input>
                    </Tab>
                  );
                })}
              </Tabs>
              <br />
              <p>Block display type</p>
              <Select
                onChange={(option) => {
                  setCurrentForm({
                    ...currentForm,
                    type: option.value,
                  });
                }}
                options={formTypeSelect}
                placeholder="block type"
              />
              <br />
              <p>Form Fields</p>
              {modelField.id.includes('.') ? (
                <>
                  {currentSettings.models
                    .find((model) => {
                      return model.id === modelField.type;
                    })
                    .fields.map((field, index) => {
                      if (field?.create || field?.update || field?.read) {
                        return (
                          <span key={index} style={{ margin: '15px' }}>
                            <Checkbox
                              checked={currentForm?.fields[field.name]}
                              onChange={(value) => {
                                setCurrentForm({
                                  ...currentForm,
                                  fields: {
                                    ...currentForm.fields,
                                    [field.name]: value,
                                  },
                                });
                              }}
                            >
                              {field.name}
                            </Checkbox>
                          </span>
                        );
                      }
                    })}
                </>
              ) : (
                <>
                  {model?.fields?.map((field, index) => {
                    const ownerModel = currentSettings.models.find(
                      (ownermodel) => ownermodel.id === modelField.id,
                    );
                    const ownerField = ownerModel.fields.find((ownerfield) => {
                      return ownerfield.id === field.id;
                    });
                    if (
                      ownerField?.create ||
                      ownerField?.update ||
                      ownerField?.read
                    ) {
                      return (
                        <span key={index} style={{ margin: '15px' }}>
                          <Checkbox
                            checked={currentForm?.fields[field.name]}
                            onChange={(value) => {
                              setCurrentForm({
                                ...currentForm,
                                fields: {
                                  ...currentForm.fields,
                                  [field.name]: value,
                                },
                              });
                            }}
                          >
                            {field.name}
                          </Checkbox>
                        </span>
                      );
                    }
                  })}
                </>
              )}

              <Button
                onClick={async () => {
                  let newModelPageForm = {};
                  if (modelField.id.includes('.')) {
                    newModelPageForm = {
                      ...modelPagesPath,
                      dynamicTables: {
                        ...modelPagesPath?.dynamicTables,
                        [modelField.type]: {
                          ...modelPagesPath?.dynamicTables[modelField.type],
                          forms: {
                            ...modelPagesPath?.dynamicTables[modelField.type]
                              ?.forms,
                            [currentForm.header.id.title]: currentForm,
                          },
                        },
                      },
                    };
                  } else {
                    newModelPageForm = {
                      ...modelPagesPath,
                      forms: {
                        ...modelPagesPath.forms,
                        [currentForm.header.id.title]: currentForm,
                      },
                    };
                  }

                  console.log(newModelPageForm, model);
                  let data = JSON.parse(JSON.stringify(model));
                  delete data.id;

                  await updateModel({
                    variables: {
                      role: `prisma/framework/owners/${owner}.json`,
                      id: model.id,
                      data: {
                        ...data,
                        plugins: {
                          ...data.plugins,
                          pagesPath: {
                            ...data.plugins.pagesPath,
                            [pagesPath.name]: newModelPageForm,
                          },
                        },
                      },
                    },
                  });

                  refetch();
                  setCurrentForm(null);
                }}
              >
                Save
              </Button>
            </CardBody>
          </Card>
        )}
      </>
    );
  } else {
    return null;
  }
};

export const DynamicTableEdit = ({
  modelField,
  currentSettings,
  setCurrentSettings,
  owner,
  pagesPath,
  refetch,
}) => {
  const tabs = countries.map((country) => {
    return {
      title: country.country_long,
      code: country.country_short,
    };
  });
  const [updateModel] = useMutation(UPDATE_MODEL);
  tabs.push({ title: 'id', code: 'id' });
  const model = modelField.id.includes('.')
    ? currentSettings?.models.find(
        (model) => model.id === modelField.id.split('.')[0],
      )
    : currentSettings?.models.find((model) => model.id === modelField.id);
  const [modelPagesPath, setModelPagesPath] = useState(
    model?.plugins?.pagesPath[pagesPath.name],
  );
  console.log(model, modelPagesPath);
  const fieldBreakPointsMdValue = modelField.id.includes('.')
    ? (modelPagesPath?.dynamicTables &&
        modelPagesPath?.dynamicTables[modelField.type] &&
        modelPagesPath?.dynamicTables[modelField.type]?.grid?.fieldBreakPoints
          ?.md) ||
      4
    : modelPagesPath?.grid?.fieldBreakPoints?.md || 4;

  const fieldBreakPointsMdOnChange = (e) => {
    const fieldBreakPointMdValue = modelField.id.includes('.')
      ? {
          ...modelPagesPath,
          dynamicTables: {
            ...modelPagesPath?.dynamicTables,
            [modelField.type]: {
              ...(modelPagesPath?.dynamicTables &&
                modelPagesPath?.dynamicTables[modelField.type]),
              grid: {
                ...(modelPagesPath?.dynamicTables &&
                  modelPagesPath?.dynamicTables[modelField.type] &&
                  modelPagesPath?.dynamicTables[modelField.type]?.grid),
                fieldBreakPoints: {
                  ...(modelPagesPath?.dynamicTables &&
                    modelPagesPath?.dynamicTables[modelField.type] &&
                    modelPagesPath?.dynamicTables[modelField.type]?.grid &&
                    modelPagesPath?.dynamicTables[modelField.type]?.grid
                      ?.fieldBreakPoints),
                  md: e.target.value,
                },
              },
            },
          },
        }
      : {
          ...modelPagesPath,
          grid: {
            ...modelPagesPath?.grid,
            fieldBreakPoints: {
              ...modelPagesPath?.grid?.fieldBreakPoints,
              md: e.target.value,
            },
          },
        };
    setModelPagesPath(fieldBreakPointMdValue);
  };

  const fieldBreakPointsXsValue = modelField.id.includes('.')
    ? (modelPagesPath?.dynamicTables &&
        modelPagesPath?.dynamicTables[modelField.type] &&
        modelPagesPath?.dynamicTables[modelField.type]?.grid?.fieldBreakPoints
          ?.xs) ||
      4
    : modelPagesPath?.grid?.fieldBreakPoints?.xs || 4;

  const fieldBreakPointsXsOnChange = (e) => {
    const fieldBreakPointXsValue = modelField.id.includes('.')
      ? {
          ...modelPagesPath,
          dynamicTables: {
            ...modelPagesPath?.dynamicTables,
            [modelField.type]: {
              ...(modelPagesPath?.dynamicTables &&
                modelPagesPath?.dynamicTables[modelField.type]),
              grid: {
                ...(modelPagesPath?.dynamicTables &&
                  modelPagesPath?.dynamicTables[modelField.type] &&
                  modelPagesPath?.dynamicTables[modelField.type]?.grid),
                fieldBreakPoints: {
                  ...(modelPagesPath?.dynamicTables &&
                    modelPagesPath?.dynamicTables[modelField.type] &&
                    modelPagesPath?.dynamicTables[modelField.type]?.grid &&
                    modelPagesPath?.dynamicTables[modelField.type]?.grid
                      ?.fieldBreakPoints),
                  xs: e.target.value,
                },
              },
            },
          },
        }
      : {
          ...modelPagesPath,
          grid: {
            ...modelPagesPath?.grid,
            fieldBreakPoints: {
              ...modelPagesPath?.grid?.fieldBreakPoints,
              xs: e.target.value,
            },
          },
        };
    setModelPagesPath(fieldBreakPointXsValue);
  };

  const cardBreakPointsMdValue = modelField.id.includes('.')
    ? (modelPagesPath?.dynamicTables &&
        modelPagesPath?.dynamicTables[modelField.type] &&
        modelPagesPath?.dynamicTables[modelField.type]?.grid?.cardBreakPoints
          ?.md) ||
      4
    : modelPagesPath?.grid?.cardBreakPoints?.md || 4;

  const cardBreakPointsMdOnChange = (e) => {
    const cardBreakPointMdValue = modelField.id.includes('.')
      ? {
          ...modelPagesPath,
          dynamicTables: {
            ...modelPagesPath?.dynamicTables,
            [modelField.type]: {
              ...(modelPagesPath?.dynamicTables &&
                modelPagesPath?.dynamicTables[modelField.type]),
              grid: {
                ...(modelPagesPath?.dynamicTables &&
                  modelPagesPath?.dynamicTables[modelField.type] &&
                  modelPagesPath?.dynamicTables[modelField.type]?.grid),
                cardBreakPoints: {
                  ...(modelPagesPath?.dynamicTables &&
                    modelPagesPath?.dynamicTables[modelField.type] &&
                    modelPagesPath?.dynamicTables[modelField.type]?.grid &&
                    modelPagesPath?.dynamicTables[modelField.type]?.grid
                      ?.cardBreakPoints),
                  md: e.target.value,
                },
              },
            },
          },
        }
      : {
          ...modelPagesPath,
          grid: {
            ...modelPagesPath?.grid,
            cardBreakPoints: {
              ...modelPagesPath?.grid?.cardBreakPoints,
              md: e.target.value,
            },
          },
        };
    setModelPagesPath(cardBreakPointMdValue);
  };

  const cardBreakPointsXsValue = modelField.id.includes('.')
    ? (modelPagesPath?.dynamicTables &&
        modelPagesPath?.dynamicTables[modelField.type] &&
        modelPagesPath?.dynamicTables[modelField.type]?.grid?.cardBreakPoints
          ?.xs) ||
      4
    : modelPagesPath?.grid?.cardBreakPoints?.xs || 4;

  const cardBreakPointsXsOnChange = (e) => {
    const cardBreakPointXsValue = modelField.id.includes('.')
      ? {
          ...modelPagesPath,
          dynamicTables: {
            ...modelPagesPath?.dynamicTables,
            [modelField.type]: {
              ...(modelPagesPath?.dynamicTables &&
                modelPagesPath?.dynamicTables[modelField.type]),
              grid: {
                ...(modelPagesPath?.dynamicTables &&
                  modelPagesPath?.dynamicTables[modelField.type] &&
                  modelPagesPath?.dynamicTables[modelField.type]?.grid),
                cardBreakPoints: {
                  ...(modelPagesPath?.dynamicTables &&
                    modelPagesPath?.dynamicTables[modelField.type] &&
                    modelPagesPath?.dynamicTables[modelField.type]?.grid &&
                    modelPagesPath?.dynamicTables[modelField.type]?.grid
                      ?.cardBreakPoints),
                  xs: e.target.value,
                },
              },
            },
          },
        }
      : {
          ...modelPagesPath,
          grid: {
            ...modelPagesPath?.grid,
            cardBreakPoints: {
              ...modelPagesPath?.grid?.cardBreakPoints,
              xs: e.target.value,
            },
          },
        };
    setModelPagesPath(cardBreakPointXsValue);
  };

  const buttonBreakPointsMdValue = modelField.id.includes('.')
    ? (modelPagesPath?.dynamicTables &&
        modelPagesPath?.dynamicTables[modelField.type] &&
        modelPagesPath?.dynamicTables[modelField.type]?.grid?.buttonBreakPoints
          ?.md) ||
      4
    : modelPagesPath?.grid?.buttonBreakPoints?.md || 4;

  const buttonBreakPointsMdOnChange = (e) => {
    const buttonBreakPointMdValue = modelField.id.includes('.')
      ? {
          ...modelPagesPath,
          dynamicTables: {
            ...modelPagesPath?.dynamicTables,
            [modelField.type]: {
              ...(modelPagesPath?.dynamicTables &&
                modelPagesPath?.dynamicTables[modelField.type]),
              grid: {
                ...(modelPagesPath?.dynamicTables &&
                  modelPagesPath?.dynamicTables[modelField.type] &&
                  modelPagesPath?.dynamicTables[modelField.type]?.grid),
                buttonBreakPoints: {
                  ...(modelPagesPath?.dynamicTables &&
                    modelPagesPath?.dynamicTables[modelField.type] &&
                    modelPagesPath?.dynamicTables[modelField.type]?.grid &&
                    modelPagesPath?.dynamicTables[modelField.type]?.grid
                      ?.buttonBreakPoints),
                  md: e.target.value,
                },
              },
            },
          },
        }
      : {
          ...modelPagesPath,
          grid: {
            ...modelPagesPath?.grid,
            buttonBreakPoints: {
              ...modelPagesPath?.grid?.buttonBreakPoints,
              md: e.target.value,
            },
          },
        };
    setModelPagesPath(buttonBreakPointMdValue);
  };

  const buttonBreakPointsXsValue = modelField.id.includes('.')
    ? (modelPagesPath?.dynamicTables &&
        modelPagesPath?.dynamicTables[modelField.type] &&
        modelPagesPath?.dynamicTables[modelField.type]?.grid?.buttonBreakPoints
          ?.xs) ||
      4
    : modelPagesPath?.grid?.buttonBreakPoints?.xs || 4;

  const buttonBreakPointsXsOnChange = (e) => {
    const buttonBreakPointXsValue = modelField.id.includes('.')
      ? {
          ...modelPagesPath,
          dynamicTables: {
            ...modelPagesPath?.dynamicTables,
            [modelField.type]: {
              ...(modelPagesPath?.dynamicTables &&
                modelPagesPath?.dynamicTables[modelField.type]),
              grid: {
                ...(modelPagesPath?.dynamicTables &&
                  modelPagesPath?.dynamicTables[modelField.type] &&
                  modelPagesPath?.dynamicTables[modelField.type]?.grid),
                buttonBreakPoints: {
                  ...(modelPagesPath?.dynamicTables &&
                    modelPagesPath?.dynamicTables[modelField.type] &&
                    modelPagesPath?.dynamicTables[modelField.type]?.grid &&
                    modelPagesPath?.dynamicTables[modelField.type]?.grid
                      ?.buttonBreakPoints),
                  xs: e.target.value,
                },
              },
            },
          },
        }
      : {
          ...modelPagesPath,
          grid: {
            ...modelPagesPath?.grid,
            buttonBreakPoints: {
              ...modelPagesPath?.grid?.buttonBreakPoints,
              xs: e.target.value,
            },
          },
        };
    setModelPagesPath(buttonBreakPointXsValue);
  };
  // const onSaveClick,

  if (model) {
    return (
      <>
        <Tabs>
          {tabs.map((tab) => {
            // if modelField.id includes "." it means that its a field model. and field model has type

            const createTitleValue = modelField.id.includes('.')
              ? (modelPagesPath?.dynamicTables &&
                  modelPagesPath?.dynamicTables[modelField.type] &&
                  modelPagesPath?.dynamicTables[modelField.type].header &&
                  modelPagesPath?.dynamicTables[modelField.type].header[
                    tab.code
                  ]?.createTitle) ||
                `${modelField.id}CreateTitle`
              : (modelPagesPath?.header &&
                  modelPagesPath?.header[tab.code]?.createTitle) ||
                `${modelField.id}CreateTitle`;

            const createTitleOnChange = (e) => {
              const createTitleSettingValue = modelField.id.includes('.')
                ? {
                    ...modelPagesPath,
                    dynamicTables: {
                      ...modelPagesPath?.dynamicTables,
                      [modelField.type]: {
                        ...(modelPagesPath?.dynamicTables &&
                          modelPagesPath?.dynamicTables[modelField.type]),
                        header: {
                          ...(modelPagesPath?.dynamicTables?.[
                            modelField.type
                          ] &&
                            modelPagesPath?.dynamicTables[modelField.type]
                              .header),
                          [tab.code]: {
                            ...(modelPagesPath?.dynamicTables?.[
                              modelField.type
                            ] &&
                              modelPagesPath?.dynamicTables[modelField.type]
                                ?.header &&
                              modelPagesPath?.dynamicTables[modelField.type]
                                ?.header[tab.code]),
                            createTitle: e.target.value,
                          },
                        },
                      },
                    },
                  }
                : {
                    ...modelPagesPath,
                    header: {
                      ...modelPagesPath?.header,
                      [tab.code]: {
                        ...(modelPagesPath.header &&
                          modelPagesPath?.header[tab.code]),
                        createTitle: e.target.value,
                      },
                    },
                  };
              setModelPagesPath(createTitleSettingValue);
            };

            const createDescriptionValue = modelField.id.includes('.')
              ? (modelPagesPath?.dynamicTables &&
                  modelPagesPath?.dynamicTables[modelField.type] &&
                  modelPagesPath?.dynamicTables[modelField.type].header &&
                  modelPagesPath?.dynamicTables[modelField.type].header[
                    tab.code
                  ]?.createDescription) ||
                `${modelField.id}CreateDescription`
              : (modelPagesPath?.header &&
                  modelPagesPath?.header[tab.code]?.createDescription) ||
                `${modelField.id}CreateDescription`;

            const createDescriptionOnChange = (e) => {
              const createDescriptionSettingValue = modelField.id.includes('.')
                ? {
                    ...modelPagesPath,
                    dynamicTables: {
                      ...modelPagesPath?.dynamicTables,
                      [modelField.type]: {
                        ...(modelPagesPath?.dynamicTables &&
                          modelPagesPath.dynamicTables[modelField.type]),
                        header: {
                          ...(modelPagesPath?.dynamicTables?.[
                            modelField.type
                          ] &&
                            modelPagesPath?.dynamicTables[modelField.type]
                              .header),
                          [tab.code]: {
                            ...(modelPagesPath?.dynamicTables?.[
                              modelField.type
                            ] &&
                              modelPagesPath?.dynamicTables[modelField.type]
                                ?.header &&
                              modelPagesPath?.dynamicTables[modelField.type]
                                ?.header[tab.code]),
                            createDescription: e.target.value,
                          },
                        },
                      },
                    },
                  }
                : {
                    ...modelPagesPath,
                    header: {
                      ...modelPagesPath?.header,
                      [tab.code]: {
                        ...modelPagesPath?.header[tab.code],
                        createDescription: e.target.value,
                      },
                    },
                  };
              setModelPagesPath(createDescriptionSettingValue);
            };

            const updateTitleValue = modelField.id.includes('.')
              ? (modelPagesPath?.dynamicTables &&
                  modelPagesPath?.dynamicTables[modelField.type] &&
                  modelPagesPath?.dynamicTables[modelField.type].header &&
                  modelPagesPath?.dynamicTables[modelField.type].header[
                    tab.code
                  ]?.updateTitle) ||
                `${modelField.id}UpdateTitle`
              : (modelPagesPath?.header &&
                  modelPagesPath?.header[tab.code]?.updateTitle) ||
                `${modelField.id}UpdateTitle`;

            const updateTitleOnChange = (e) => {
              const updateTitleSettingValue = modelField.id.includes('.')
                ? {
                    ...modelPagesPath,
                    dynamicTables: {
                      ...modelPagesPath?.dynamicTables,
                      [modelField.type]: {
                        ...(modelPagesPath?.dynamicTables &&
                          modelPagesPath.dynamicTables[modelField.type]),
                        header: {
                          ...(modelPagesPath?.dynamicTables?.[
                            modelField.type
                          ] &&
                            modelPagesPath?.dynamicTables[modelField.type]
                              .header),
                          [tab.code]: {
                            ...(modelPagesPath?.dynamicTables?.[
                              modelField.type
                            ] &&
                              modelPagesPath?.dynamicTables[modelField.type]
                                ?.header &&
                              modelPagesPath?.dynamicTables[modelField.type]
                                ?.header[tab.code]),
                            updateTitle: e.target.value,
                          },
                        },
                      },
                    },
                  }
                : {
                    ...modelPagesPath,
                    header: {
                      ...modelPagesPath?.header,
                      [tab.code]: {
                        ...(modelPagesPath.header &&
                          modelPagesPath?.header[tab.code]),
                        updateTitle: e.target.value,
                      },
                    },
                  };
              setModelPagesPath(updateTitleSettingValue);
            };

            const updateDescriptionValue = modelField.id.includes('.')
              ? (modelPagesPath?.dynamicTables &&
                  modelPagesPath?.dynamicTables[modelField.type] &&
                  modelPagesPath?.dynamicTables[modelField.type].header &&
                  modelPagesPath?.dynamicTables[modelField.type].header[
                    tab.code
                  ]?.updateDescription) ||
                `${modelField.id}UpdateDescription`
              : (modelPagesPath?.header &&
                  modelPagesPath?.header[tab.code]?.updateDescription) ||
                `${modelField.id}UpdateDescription`;

            const updateDescriptionOnChange = (e) => {
              const updateDescriptionSettingValue = modelField.id.includes('.')
                ? {
                    ...modelPagesPath,
                    dynamicTables: {
                      ...modelPagesPath?.dynamicTables,
                      [modelField.type]: {
                        ...(modelPagesPath?.dynamicTables &&
                          modelPagesPath.dynamicTables[modelField.type]),
                        header: {
                          ...(modelPagesPath?.dynamicTables?.[
                            modelField.type
                          ] &&
                            modelPagesPath?.dynamicTables[modelField.type]
                              .header),
                          [tab.code]: {
                            ...(modelPagesPath?.dynamicTables?.[
                              modelField.type
                            ] &&
                              modelPagesPath?.dynamicTables[modelField.type]
                                ?.header &&
                              modelPagesPath?.dynamicTables[modelField.type]
                                ?.header[tab.code]),
                            updateDescription: e.target.value,
                          },
                        },
                      },
                    },
                  }
                : {
                    ...modelPagesPath,
                    header: {
                      ...modelPagesPath?.header,
                      [tab.code]: {
                        ...(modelPagesPath.header &&
                          modelPagesPath?.header[tab.code]),
                        updateDescription: e.target.value,
                      },
                    },
                  };
              setModelPagesPath(updateDescriptionSettingValue);
            };

            const listTitleValue = modelField.id.includes('.')
              ? (modelPagesPath?.dynamicTables &&
                  modelPagesPath?.dynamicTables[modelField.type] &&
                  modelPagesPath?.dynamicTables[modelField.type].header &&
                  modelPagesPath?.dynamicTables[modelField.type].header[
                    tab.code
                  ]?.listTitle) ||
                `${modelField.id}ListTitle`
              : (modelPagesPath?.header &&
                  modelPagesPath?.header[tab.code]?.listTitle) ||
                `${modelField.id}ListTitle`;

            const listTitleOnChange = (e) => {
              const listTitleSettingValue = modelField.id.includes('.')
                ? {
                    ...modelPagesPath,
                    dynamicTables: {
                      ...modelPagesPath?.dynamicTables,
                      [modelField.type]: {
                        ...(modelPagesPath?.dynamicTables &&
                          modelPagesPath.dynamicTables[modelField.type]),
                        header: {
                          ...(modelPagesPath?.dynamicTables?.[
                            modelField.type
                          ] &&
                            modelPagesPath?.dynamicTables[modelField.type]
                              .header),
                          [tab.code]: {
                            ...(modelPagesPath?.dynamicTables?.[
                              modelField.type
                            ] &&
                              modelPagesPath?.dynamicTables[modelField.type]
                                ?.header &&
                              modelPagesPath?.dynamicTables[modelField.type]
                                ?.header[tab.code]),
                            listTitle: e.target.value,
                          },
                        },
                      },
                    },
                  }
                : {
                    ...modelPagesPath,
                    header: {
                      ...modelPagesPath?.header,
                      [tab.code]: {
                        ...(modelPagesPath.header &&
                          modelPagesPath?.header[tab.code]),
                        listTitle: e.target.value,
                      },
                    },
                  };

              setModelPagesPath(listTitleSettingValue);
            };

            const listDescriptionValue = modelField.id.includes('.')
              ? (modelPagesPath?.dynamicTables &&
                  modelPagesPath?.dynamicTables[modelField.type] &&
                  modelPagesPath?.dynamicTables[modelField.type].header &&
                  modelPagesPath?.dynamicTables[modelField.type].header[
                    tab.code
                  ]?.listDescription) ||
                `${modelField.id}ListDescription`
              : (modelPagesPath?.header &&
                  modelPagesPath?.header[tab.code]?.listDescription) ||
                `${modelField.id}ListDescription`;

            const listDescriptionOnChange = (e) => {
              const listDescriptionSettingValue = modelField.id.includes('.')
                ? {
                    ...modelPagesPath,
                    dynamicTables: {
                      ...modelPagesPath?.dynamicTables,
                      [modelField.type]: {
                        ...(modelPagesPath?.dynamicTables &&
                          modelPagesPath.dynamicTables[modelField.type]),
                        header: {
                          ...(modelPagesPath?.dynamicTables?.[
                            modelField.type
                          ] &&
                            modelPagesPath?.dynamicTables[modelField.type]
                              .header),
                          [tab.code]: {
                            ...(modelPagesPath?.dynamicTables?.[
                              modelField.type
                            ] &&
                              modelPagesPath?.dynamicTables[modelField.type]
                                ?.header &&
                              modelPagesPath?.dynamicTables[modelField.type]
                                ?.header[tab.code]),
                            listDescription: e.target.value,
                          },
                        },
                      },
                    },
                  }
                : {
                    ...modelPagesPath,
                    header: {
                      ...modelPagesPath?.header,
                      [tab.code]: {
                        ...(modelPagesPath.header &&
                          modelPagesPath?.header[tab.code]),
                        listDescription: e.target.value,
                      },
                    },
                  };
              setModelPagesPath(listDescriptionSettingValue);
            };

            return (
              <Tab key={tab.code} title={tab.title}>
                {modelField?.create && (
                  <>
                    <p>Create Title</p>
                    <Input>
                      <input
                        value={createTitleValue}
                        onChange={createTitleOnChange}
                        type="text"
                        placeholder="create title"
                      />
                    </Input>
                    <p>Create Description</p>
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
                    <p>Update Title</p>
                    <Input>
                      <input
                        value={updateTitleValue}
                        onChange={updateTitleOnChange}
                        type="text"
                        placeholder="update title"
                      />
                    </Input>
                    <p>Update Description</p>

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
                    <p>List Title</p>
                    <Input>
                      <input
                        value={listTitleValue}
                        onChange={listTitleOnChange}
                        type="text"
                        placeholder="list title"
                      />
                    </Input>
                    <p>List Description</p>
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
        <p>Card breakPoint xs</p>

        <Input>
          <input
            value={cardBreakPointsXsValue}
            onChange={cardBreakPointsXsOnChange}
            type="text"
            placeholder="cardBreakPoints xs"
          />
        </Input>
        <p>Card breakPoint md</p>

        <Input>
          <input
            value={cardBreakPointsMdValue}
            onChange={cardBreakPointsMdOnChange}
            type="text"
            placeholder="cardBreakPoints md"
          />
        </Input>
        <br />
        <p>Field breakPoint xs</p>
        <Input>
          <input
            value={fieldBreakPointsXsValue}
            onChange={fieldBreakPointsXsOnChange}
            type="text"
            placeholder="fieldBreakPoints xs"
          />
        </Input>
        <p>Field breakPoint md</p>

        <Input>
          <input
            value={fieldBreakPointsMdValue}
            onChange={fieldBreakPointsMdOnChange}
            type="text"
            placeholder="fieldBreakPoints md"
          />
        </Input>
        <br />
        <p>Button breakPoint xs</p>

        <Input>
          <input
            value={buttonBreakPointsXsValue}
            onChange={buttonBreakPointsXsOnChange}
            type="text"
            placeholder="buttonBreakPoints xs"
          />
        </Input>
        <p>Button breakPoint md</p>

        <Input>
          <input
            value={buttonBreakPointsMdValue}
            onChange={buttonBreakPointsMdOnChange}
            type="text"
            placeholder="buttonBreakPoints md"
          />
        </Input>

        <Button
          onClick={async () => {
            let data = JSON.parse(JSON.stringify(model));
            delete data.id;
            await updateModel({
              variables: {
                role: `prisma/framework/owners/${owner}.json`,
                id: modelField.id.includes('.')
                  ? modelField.id.split('.')[0]
                  : model.id,
                data: {
                  ...data,
                  plugins: {
                    ...data.plugins,
                    pagesPath: {
                      ...data.plugins.pagesPath,
                      [pagesPath.name]: modelPagesPath,
                    },
                  },
                },
              },
            });
            refetch();
          }}
        >
          Save
        </Button>
      </>
    );
  } else {
    return null;
  }
};

export const PagesPath = ({
  pageModels,
  currentSettings,
  setCurrentSettings,
  owner,
  pagesPath,
  refetch,
}) => {
  const [modelRelatedTable, setModelRelatedTable] = useState(null);
  console.log(modelRelatedTable);
  return (
    <Card>
      <Tabs>
        {pageModels.map((pageModel, index) => {
          const modelTableSelect = pageModel.fields
            .filter(
              (field) =>
                field.list && (field.create || field.read || field.update),
            )
            .map((field) => {
              return {
                label: field.name,
                value: field.type,
              };
            });
          return (
            <Tab key={index} title={pageModel.id}>
              <Row>
                <Col breakPoint={{ xs: 6 }}>
                  <h6>Current Model</h6>
                  <Card>
                    <CardBody>
                      <p>Settings</p>
                      <DynamicTableEdit
                        refetch={refetch}
                        owner={owner}
                        pagesPath={pagesPath}
                        modelField={pageModel}
                        currentSettings={currentSettings}
                        setCurrentSettings={setCurrentSettings}
                      />
                    </CardBody>
                  </Card>
                </Col>
                <Col breakPoint={{ xs: 6 }}>
                  <FormBlockEdit
                    refetch={refetch}
                    owner={owner}
                    pagesPath={pagesPath}
                    modelField={pageModel}
                    currentSettings={currentSettings}
                    setCurrentSettings={setCurrentSettings}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <h6>Related Models Table</h6>
                  <Select
                    onChange={(option) => {
                      const modelField = pageModel.fields.find(
                        (field) => field.type === option.value,
                      );

                      setModelRelatedTable(modelField);
                    }}
                    options={modelTableSelect}
                    placeholder="Model"
                  />
                </Col>{' '}
              </Row>
              {modelRelatedTable && (
                <Row>
                  {modelRelatedTable.read && (
                    <Col breakPoint={{ xs: 6 }}>
                      <DynamicTableEdit
                        refetch={refetch}
                        owner={owner}
                        pagesPath={pagesPath}
                        modelField={modelRelatedTable}
                        currentSettings={currentSettings}
                        setCurrentSettings={setCurrentSettings}
                      />
                    </Col>
                  )}
                  {(modelRelatedTable.update || modelRelatedTable.create) && (
                    <Col breakPoint={{ xs: 6 }}>
                      <FormBlockEdit
                        refetch={refetch}
                        owner={owner}
                        pagesPath={pagesPath}
                        modelField={modelRelatedTable}
                        currentSettings={currentSettings}
                        setCurrentSettings={setCurrentSettings}
                      />
                    </Col>
                  )}
                </Row>
              )}
            </Tab>
          );
        })}
      </Tabs>
    </Card>
  );
};

export default function Owner() {
  const [currentSettings, setCurrentSettings] = useState(null);
  const [updateModel] = useMutation(UPDATE_MODEL);
  const {
    query: { owner },
  } = useRouter();

  const { data, error, loading, refetch } = useQuery(GET_PARENT_OWNER, {
    variables: {
      owner,
    },
    skip: !owner,
  });

  useEffect(() => {
    if (data?.parentOwner) {
      setCurrentSettings(data.parentOwner);
    }
  }, [data]);

  const pagesPaths: any[] = [];
  currentSettings?.models?.map((model, modelInex) => {
    if (model?.plugins?.pagesPath) {
      const modelPagesPaths = model.plugins.pagesPath;
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

  const ownerModels = currentSettings?.models?.filter((model) => {
    if (model.id === owner) {
      return true;
    }
    const ownerFieldExist = model.fields.find((field) => {
      if (!field.list && field.type === owner) {
        return field;
      }
    });

    if (ownerFieldExist) {
      return true;
    }
  });
  const ownerModelsSelect = ownerModels?.map((model) => {
    return {
      label: model.name,
      value: model.id,
    };
  });
  const [editing, setEditing] = useState(null);

  if (currentSettings) {
    return (
      <>
        <Link href="/admin/auth/parent-builder">
          <Button size="Small">To Root</Button>
        </Link>
        <h4>{owner}'s children models</h4>
        <Tabs>
          <Tab title="Model Permission">
            <Row>
              {currentSettings.models.map((model, index) => {
                let data = JSON.parse(JSON.stringify(model));
                delete data.id;
                return (
                  <Col breakPoint={{ xs: 3 }} key={index}>
                    <Card>
                      <CardBody>
                        <p>{model.id}</p>
                        {model?.plugins?.parent && editing?.id !== model?.id ? (
                          <>
                            <div>Parent: {model.plugins.parent}</div>
                            <Button
                              size="Small"
                              onClick={() => setEditing(model)}
                            >
                              Change
                            </Button>
                          </>
                        ) : (
                          <Select
                            onChange={async (option) => {
                              await updateModel({
                                variables: {
                                  id: model.id,
                                  role: `prisma/framework/owners/${owner}.json`,
                                  data: {
                                    ...data,
                                    plugins: {
                                      ...data.plugins,
                                      parent: option.value,
                                    },
                                  },
                                },
                              });
                              setEditing(null);
                              refetch();
                            }}
                            options={ownerModelsSelect}
                          />
                        )}
                      </CardBody>
                    </Card>
                  </Col>
                );
              })}
            </Row>
            <Settings role={`prisma/framework/owners/${owner}.json`} />
          </Tab>
          <Tab title="Add New Page Path">
            <AddNewPagesPath
              currentSettings={currentSettings}
              owner={owner}
              setCurrentSettings={setCurrentSettings}
              refetch={refetch}
              ownerModels={ownerModels}
              ownerModelsSelect={ownerModelsSelect}
            />
          </Tab>
          {pagesPaths?.map((pagesPath, pagesPathIndex) => {
            const pageModels = currentSettings?.models?.filter(
              (model) =>
                !!model?.plugins?.pagesPath &&
                !!model?.plugins?.pagesPath[pagesPath.name],
            );
            return (
              <Tab key={pagesPathIndex} title={pagesPath.name}>
                <PagesPath
                  currentSettings={currentSettings}
                  refetch={refetch}
                  pageModels={pageModels}
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
        currentSettings={currentSettings}
        owner={owner}
        refetch={refetch}
        setCurrentSettings={setCurrentSettings}
      />
    );
  }
}

const AddNewPagesPath = ({
  currentSettings,
  ownerModels,
  ownerModelsSelect,
  setCurrentSettings,
  owner,
  refetch,
}) => {
  const [newPagesPath, setNewPagesPath] = useState({
    options: [],
    name: '',
  });

  const [updateModel] = useMutation(UPDATE_MODEL);
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
          options={ownerModelsSelect}
          placeholder="Model"
        />
        <br />
        <Button
          onClick={() => {
            newPagesPath.options.map(async (option) => {
              const model = ownerModels.find(
                (model) => model.id === option.value,
              );
              const grid = {
                cardBreakPoints: {
                  xs: 4,
                  md: 4,
                },
                fieldBreakPoints: {
                  xs: 4,
                  md: 4,
                },
                buttonBreakPoints: {
                  xs: 4,
                  md: 4,
                },
              };
              let header = {
                id: {
                  createTitle: `${owner}${newPagesPath.name}${option.value}CreateTitle`,
                  createDescription: `${owner}${newPagesPath.name}${option.value}CreateDescription`,
                  updateTitle: `${owner}${newPagesPath.name}${option.value}UpdateTitle`,
                  updateDescription: `${owner}${newPagesPath.name}${option.value}UpdateDescription`,
                  listTitle: `${owner}${newPagesPath.name}${option.value}ListTitle`,
                  listDescription: `${owner}${newPagesPath.name}${option.value}ListDescription`,
                },
              };
              countries.map((country) => {
                if (country?.country_short) {
                  header[country.country_short] = {
                    createTitle: `${country.country_short}${owner}${newPagesPath.name}${option.value}CreateTitle`,
                    createDescription: `${country.country_short}${owner}${newPagesPath.name}${option.value}CreateDescription`,
                    updateTitle: `${country.country_short}${owner}${newPagesPath.name}${option.value}UpdateTitle`,
                    updateDescription: `${country.country_short}${owner}${newPagesPath.name}${option.value}UpdateDescription`,
                    listTitle: `${country.country_short}${owner}${newPagesPath.name}${option.value}ListTitle`,
                    listDescription: `${country.country_short}${owner}${newPagesPath.name}${option.value}ListDescription`,
                  };
                }
              });
              const dynamicTables = {};
              model.fields.map((field) => {
                if (field.list && field.kind === 'object') {
                  dynamicTables[field.type] = {
                    type: field.type,
                    header,
                    grid,
                  };
                }
              });

              let newModel = {
                ...model,
                plugins: {
                  ...model.plugins,
                  pagesPath: {
                    ...model.plugins.pagesPath,
                    [newPagesPath.name]: {
                      name: newPagesPath.name,
                      grid,
                      header,
                      dynamicTables,
                      forms: {},
                    },
                  },
                },
              };
              delete newModel.id;

              await updateModel({
                variables: {
                  role: `prisma/framework/owners/${owner}.json`,
                  id: model.id,
                  data: newModel,
                },
              });
            });
            refetch();
          }}
        >
          Confirm
        </Button>
      </CardBody>
    </Card>
  );
};

const AddDefaultOwnerModels = ({
  setCurrentSettings,
  currentSettings,
  owner,
  refetch,
}) => {
  const [defaultOwnerModels, setDefaultOwnerModels] = useState([]);
  const [createParentOwner] = useMutation(CREATE_PARENT_OWNER);
  const ownerModels = root?.models
    ? root.models
        .filter((model) => {
          const ownerFieldExist = model.fields.find((field) => {
            if (!field.list && field.type === owner) {
              return field;
            }
          });

          if (ownerFieldExist) {
            return true;
          }
        })
        .map((model) => {
          return {
            label: model.name,
            value: model.id,
          };
        })
    : [];
  return (
    <div>
      <Link href="/admin/auth/parent-builder">
        <Button size="Small">To Root</Button>
      </Link>
      <p>Please select models that has this owner as their Parent model</p>

      <Select
        onChange={(options) => {
          setDefaultOwnerModels(options);
        }}
        isMulti
        options={ownerModels}
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
    </div>
  );
};
