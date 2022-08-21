import React, { FC, useEffect } from "react";
import { useStore } from 'effector-react'
import { useMutation } from "@apollo/client";

import { List, Button, Form, Input, Alert, Spin } from "antd";
import {CloudServerOutlined} from '@ant-design/icons'
import './styles.css'
import { $stands, getStandsEvent } from "../../../../store/stands";
import { StandCardProps } from "../../../../components/Stands/StandCard/interfaces";
import { CREATE_STAND, GET_ALL_STANDS } from "../../../../gql";
import { $displayErrorWarning, setErrorWarningEvent } from "../../../../store";
import { adminLoginMessageTypesEnum } from "../../../LoginPage/constants";
import { $serverResponseIsLoading, serServerResponseLoadingEvent } from "../../../../store/serverResponse";
import { ERROR_DUPLICATE_STAND } from "../../../../constants";

export const ContentStandsPage: FC = () => {
  const stands: StandCardProps[] = useStore($stands)
  const errorWarningMessage = useStore($displayErrorWarning)
  const serverResponseIsLoading = useStore($serverResponseIsLoading)

  getStandsEvent('/stands')

  const [form] = Form.useForm();

  const [CreateStand, {loading, error, data}] = useMutation(CREATE_STAND)

  const handleSubmit = (values: { standNumber: string, team: string }) => {
    if (values.standNumber && values.team) {
      serServerResponseLoadingEvent(true)
      CreateStand({
        variables: {
          id: values.standNumber,
          team: values.team,
        },
        refetchQueries: [
          {query: GET_ALL_STANDS
          },],
        awaitRefetchQueries: true,
      })
    }
  };

  useEffect(() => {
    if (data || error) {
      serServerResponseLoadingEvent(false)
    }
    if (error && String(error) === ERROR_DUPLICATE_STAND) {
      alert("Ошибка: Стенд с таким номером уже существует!")
    }
  }, [error, data])

  const handleFinishFailed = () => {
    setErrorWarningEvent()
  }

  return <div className="admin-page__users-container">
    <Spin spinning={serverResponseIsLoading} delay={500}>
      {errorWarningMessage && (
        <Alert message={adminLoginMessageTypesEnum.incorrect} type="error" style={{ marginBottom: "2rem" }}/>
      )}
      <Form
        layout='inline'
        form={form}
        style={{marginBottom: '2rem'}}
        onFinish={handleSubmit}
        onFinishFailed={handleFinishFailed}
      >
        <Form.Item label="Номер стенда" name="standNumber" rules={[
          {
            required: true,
            message: `Номер стенда не заполнен`,
          },
        ]}>
          <Input placeholder="В формате X-XX"/>
        </Form.Item>
        <Form.Item label="Команда" name="team" rules={[
          {
            required: true,
            message: `Команда не заполнена`,
          },
        ]}>
          <Input placeholder="Номер команды" />
        </Form.Item>
        <Form.Item >
          <Button type="primary" htmlType="submit" >Добавить стенд</Button>
        </Form.Item>
      </Form>
      <List
        itemLayout="horizontal"
        dataSource={stands}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<CloudServerOutlined />}
              title={item?.id}
              description={`Команда: ${item?.team}`}
            />
            <Button type="primary" danger>Удалить</Button>
          </List.Item>
        )}
      />
    </Spin>
  </div>
}