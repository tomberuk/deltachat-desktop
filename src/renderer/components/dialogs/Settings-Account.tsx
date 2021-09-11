import { useEffect, useState, useContext } from 'react'
import { DeltaBackend } from '../../delta-remote'
import { Card, Elevation } from '@blueprintjs/core'
import React from 'react'
import LoginForm, {
  ConfigureProgressDialog,
  defaultCredentials,
} from '../LoginForm'

import { DeltaDialogBody, DeltaDialogOkCancelFooter } from './DeltaDialog'
import { ScreenContext, useTranslationFunction } from '../../contexts'
import { Credentials } from '../../../shared/shared-types'

export default function SettingsAccount({
  setShow,
  onClose
}: {
  show: string
  setShow: (show: string) => void
  onClose: () => void
}) {
  const [, setInitialAccountSettings] = useState<Credentials>(
    defaultCredentials()
  )

  const [accountSettings, _setAccountSettings] = useState<Credentials>(
    defaultCredentials()
  )

  const [disableUpdate, setDisableUpdate] = useState(true)

  const setAccountSettings = (value: Credentials) => {
    disableUpdate === true && setDisableUpdate(false)
    _setAccountSettings(value)
  }

  const { openDialog, userFeedback } = useContext(ScreenContext)
  const tx = useTranslationFunction()

  const loadSettings = async () => {
    const accountSettings: Credentials = ((await DeltaBackend.call(
      'settings.getConfigFor',
      [
        'addr',
        'mail_pw',
        'inbox_watch',
        'sentbox_watch',
        'mvbox_watch',
        'mvbox_move',
        'e2ee_enabled',
        'mail_server',
        'mail_user',
        'mail_port',
        'mail_security',
        'imap_certificate_checks',
        'send_user',
        'send_pw',
        'send_server',
        'send_port',
        'send_security',
        'smtp_certificate_checks',
        'socks5_enabled',
        'socks5_host',
        'socks5_port',
        'socks5_user',
        'socks5_password',
      ]
    )) as unknown) as Credentials
    setInitialAccountSettings(accountSettings)
    _setAccountSettings(accountSettings)
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const onUpdate = () => {
    if (disableUpdate) return
    const onSuccess = () => onClose()

    openDialog(ConfigureProgressDialog, {
      credentials: accountSettings,
      onSuccess,
    })
  }

  if (accountSettings === null) return null
  return (
    <>
      <DeltaDialogBody noFooter>
        <Card elevation={Elevation.ONE}>
          {accountSettings && (
            <LoginForm
              credentials={accountSettings}
              setCredentials={setAccountSettings}
              addrDisabled
            />
          )}
        </Card>
      </DeltaDialogBody>
      <DeltaDialogOkCancelFooter
        onCancel={() => setShow('main')}
        onOk={onUpdate}
      />
    </>
  )
}
