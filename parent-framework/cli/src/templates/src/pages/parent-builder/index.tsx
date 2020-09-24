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
import { Settings } from '@paljs/admin';
import Select from '@paljs/ui/Select';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import Link from 'next/link';
const Input = styled(InputGroup)`
  margin-bottom: 10px;
`;

export default function Login() {
  const ownerType = defaultSettings.enums.find(
    (enumModel) => enumModel.name === 'OwnerType',
  );

  return (
    <>
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
      <h4>Models</h4>
      <Row>
        {defaultSettings?.models?.map((model, index) => {
          return (
            <Col key={index} breakPoint={{ xs: 4 }}>
              <Card>
                <CardBody>{model.id}</CardBody>
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
}
