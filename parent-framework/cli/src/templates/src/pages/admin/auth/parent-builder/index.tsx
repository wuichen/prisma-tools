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
  CREATE_PARENT_ROOT,
  GENERATE_PARENT_PAGES,
} from 'Components/PrismaAdmin/SchemaQueries';
import { Radio } from '@paljs/ui/Radio';

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
      <Button
        size="Small"
        onClick={() => {
          generatePages();
        }}
      >
        Generate Pages
      </Button>
      {data?.parentRoot ? (
        <div>
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

const ExtraRootModelSettings = ({ modelObject: model, role }) => {
  const [updateModel] = useMutation(UPDATE_MODEL);

  return (
    <div>
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
    </div>
  );
};
