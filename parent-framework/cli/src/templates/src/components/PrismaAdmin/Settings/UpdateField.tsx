import React, { useState } from 'react';
import { Checkbox } from '@paljs/ui/Checkbox';
import { InputGroup } from '@paljs/ui/Input';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import { SchemaField } from '../types';
import { useMutation } from '@apollo/client';
import { UPDATE_FIELD } from '../SchemaQueries';

type Fields =
  | 'read'
  | 'create'
  | 'update'
  | 'filter'
  | 'sort'
  | 'title'
  | 'editor'
  | 'upload';

const fieldsArray: Fields[] = [
  'read',
  'filter',
  'sort',
  'create',
  'update',
  'editor',
  'upload',
];

const UpdateField: React.FC<{
  field: SchemaField;
  model: string;
  role: string;
}> = ({ field, model, role }) => {
  const [updateField] = useMutation(UPDATE_FIELD);
  const [title, setTitle] = useState({
    value: field.title,
    typingTimeout: 0,
  });

  const onChangeHandler = (name: string, value: boolean | string) => {
    updateField({
      variables: {
        id: field.id,
        modelId: model,
        data: {
          [name]: value,
        },
        role,
      },
    });
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (title.typingTimeout) clearTimeout(title.typingTimeout);
    setTitle({
      value: newValue,
      typingTimeout: setTimeout(function () {
        onChangeHandler('title', newValue);
      }, 1000),
    });
  };

  return (
    <Row middle="xs">
      <Col breakPoint={{ xs: 12 }} style={{ marginBottom: '20px' }}>
        <Row around="xs" middle="xs">
          <Col breakPoint={{ xs: 4 }}>
            <span className="subtitle text-hint">Database Name</span>
          </Col>
          <Col breakPoint={{ xs: 8 }}>
            <span className="subtitle text-hint">{field.name}</span>
          </Col>
        </Row>
      </Col>
      <Col breakPoint={{ xs: 12 }} style={{ marginBottom: '20px' }}>
        <Row around="xs" middle="xs">
          <Col breakPoint={{ xs: 4 }}>
            <span className="subtitle text-hint">Display Name</span>
          </Col>
          <Col breakPoint={{ xs: 8 }}>
            <InputGroup>
              <input
                name="name"
                value={title.value}
                placeholder="Field Name"
                onChange={onChange}
              />
            </InputGroup>
          </Col>
        </Row>
      </Col>
      {fieldsArray.map((item) => (
        <Col breakPoint={{ xs: 4 }} key={item}>
          <Checkbox
            disabled={
              !!(field.relationField && ['create', 'update'].includes(item))
            }
            status="Success"
            checked={!!field[item]}
            onChange={(value) => onChangeHandler(item, value)}
          >
            {item}
          </Checkbox>
        </Col>
      ))}
    </Row>
  );
};
export default UpdateField;
