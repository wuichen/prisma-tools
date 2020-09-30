import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import { Checkbox } from '@paljs/ui/Checkbox';
import React, { useContext, useState, useEffect } from 'react';
import { Tabs, Tab } from '@paljs/ui/Tabs';
import { Card, CardBody } from '@paljs/ui/Card';
import low from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';
import defaultSettings from '../../../../../prisma/adminSettings.json';
import styled from 'styled-components';
import { Settings } from 'Components/PrismaAdmin/Settings';
import Select from '@paljs/ui/Select';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import Link from 'next/link';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_PARENT_ROOT,
  GET_SCHEMA,
  UPDATE_MODEL,
  UPDATE_FIELD,
  CREATE_PARENT_ROOT,
  GENERATE_PARENT_PAGES,
} from 'Components/PrismaAdmin/SchemaQueries';
import { Radio } from '@paljs/ui/Radio';
import countries from 'settings/countries';

const Input = styled(InputGroup)`
  margin-bottom: 10px;
`;

export default function ParentBuilder() {
  const ownerType = defaultSettings.enums.find(
    (enumModel) => enumModel.name === 'OwnerType',
  );
  const [createParentRoot] = useMutation(CREATE_PARENT_ROOT);
  const { data, error, loading, refetch } = useQuery(GET_PARENT_ROOT);

  const [generatePages] = useMutation(GENERATE_PARENT_PAGES);

  return (
    <div>
      {data?.parentRoot ? (
        <div>
          <Button
            size="Small"
            onClick={() => {
              generatePages();
            }}
          >
            Generate Pages
          </Button>
          <h4>Owner Types</h4>
          <Row>
            {ownerType?.fields?.map((field, index) => {
              return (
                <Col key={index} breakPoint={{ xs: 4 }}>
                  <Link href={`/admin/auth/parent-builder/${field}`}>
                    <Card>
                      <CardBody>{field}</CardBody>
                    </Card>
                  </Link>
                </Col>
              );
            })}
          </Row>
          <Settings
            modelExtraSettings={ExtraRootModelSettings}
            fieldExtraSettings={ExtraRootFieldSettings}
            role={`prisma/framework/root.json`}
          />
        </div>
      ) : (
        <div>
          <Button
            onClick={async () => {
              await createParentRoot();
              refetch();
            }}
          >
            Create Parent Root
          </Button>
        </div>
      )}
    </div>
  );
}

const ExtraRootFieldSettings = ({ modelObject: model, role, field }) => {
  const [updateField] = useMutation(UPDATE_FIELD);
  const tabs = countries.map((country) => {
    return {
      title: country.country_long,
      code: country.country_short,
    };
  });
  const [currentPlugins, setCurrentPlugins] = useState(field.plugins);
  return (
    <>
      <Tabs>
        {tabs.map((tab, index) => {
          const intlValue = currentPlugins.intl[tab.code] || field.name;
          const intlValueOnChange = (e) => {
            setCurrentPlugins({
              ...field.plugins,
              intl: {
                ...field.plugins.intl,
                [tab.code]: e.target.value,
              },
            });
          };
          return (
            <Tab title={tab.title}>
              <p>Localized Text</p>
              <Input>
                <input
                  value={intlValue}
                  onChange={intlValueOnChange}
                  type="text"
                  placeholder={field.title}
                />
              </Input>
            </Tab>
          );
        })}
      </Tabs>
      <Button
        onClick={() => {
          updateField({
            variables: {
              id: field.id,
              modelId: model.id,
              data: {
                plugins: currentPlugins,
              },
              role,
            },
          });
        }}
      >
        Save Localization
      </Button>
    </>
  );
};

const ExtraRootModelSettings = ({ modelObject: model, role }) => {
  const [updateModel] = useMutation(UPDATE_MODEL);
  const tabs = countries.map((country) => {
    return {
      title: country.country_long,
      code: country.country_short,
    };
  });
  const [currentPlugins, setCurrentPlugins] = useState(model.plugins);

  return (
    <div>
      <h6>Model Type</h6>
      <Radio
        name="radio"
        onChange={(value) => {
          updateModel({
            variables: {
              id: model.id,
              data: {
                plugins: {
                  ...model.plugins,
                  type: value,
                },
              },
              role,
            },
          });
        }}
        options={[
          {
            value: 'public',
            label: 'Public Model',
            checked: model.plugins.type === 'public',
          },
          {
            value: 'private',
            label: 'Private Model',
            checked: model.plugins.type === 'private',
          },
          {
            value: 'system',
            label: 'System Model',
            checked: model.plugins.type === 'system',
          },
        ]}
      />
      <br />
      <Tabs>
        {tabs.map((tab, index) => {
          const intlValue = currentPlugins.intl[tab.code] || model.name;
          const intlValueOnChange = (e) => {
            setCurrentPlugins({
              ...model.plugins,
              intl: {
                ...model.plugins.intl,
                [tab.code]: e.target.value,
              },
            });
          };
          return (
            <Tab title={tab.title}>
              <p>Localized Text</p>
              <Input>
                <input
                  value={intlValue}
                  onChange={intlValueOnChange}
                  type="text"
                  placeholder={model.name}
                />
              </Input>
            </Tab>
          );
        })}
      </Tabs>
      <Button
        onClick={() => {
          updateModel({
            variables: {
              id: model.id,
              data: {
                plugins: currentPlugins,
              },
              role,
            },
          });
        }}
      >
        Save Localization
      </Button>
    </div>
  );
};
