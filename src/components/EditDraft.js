import React, { useContext } from 'react'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  colors,
  Divider,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  Typography,
  withStyles,
} from '@material-ui/core'
import DraftsIcon from '@material-ui/icons/Drafts'
import ClearIcon from '@material-ui/icons/Clear'
import MinimizeIcon from '@material-ui/icons/Minimize'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

import ContactsContext from '../context/contacts'
import DraftsContext from '../context/drafts'
import useGmailAPI from '../utils/hooks/gmail_api'

const styles = () => ({
  root: {
    position: 'absolute',
    bottom: 0,
    zIndex: 9999,
    right: 0,
    marginRight: '8px',
    marginLeft: '8px',
    maxHeight: 'calc(100vh - 80px)',
  },
  card: {
    width: '480px',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    boxShadow: '0 8px 16px rgba(0,0,0,0.45)',
  },
  header: {
    background: colors.grey[800],
    height: 40,
  },
  icon: {
    height: 18,
    width: 18,
  },
  logoIcon: {
    color: colors.grey[50],
  },
  iconButton: {
    padding: 0,
    margin: '0 4px',
    color: colors.grey[400],
    transition: 'color 0.2s',
    '&:hover': {
      color: colors.grey[50],
    },
  },
  content: {
    padding: 0,
  },
  input: {
    padding: '4px 12px',
    display: 'block',
  },
  subject: {
    padding: '12px 12px',
    fontWeight: 'bold',
  },
})

const EditDraft = ({
  classes, sender, id, subject, receipients, content,
}) => {
  const { t } = useTranslation(['draft'])
  const { closeDraftEdit } = useContext(DraftsContext)
  const { contacts } = useContext(ContactsContext)
  const { updateDraft, sendDraft, deleteDraft } = useGmailAPI()
  const draft = {
    id,
    receipients,
    sender,
    subject,
    content,
  }
  const update = (field) => (e) => updateDraft({ ...draft, [field]: e.target.value })
  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          className={classes.header}
          avatar={<DraftsIcon className={classNames(classes.icon, classes.logoIcon)} />}
          action={(
            <span>
              <IconButton className={classes.iconButton}>
                <MinimizeIcon className={classes.icon} />
              </IconButton>
              <IconButton className={classes.iconButton} onClick={() => (content ? closeDraftEdit(id) : deleteDraft(id))}>
                <ClearIcon className={classes.icon} />
              </IconButton>
            </span>
          )}
        />
        <CardContent className={classes.content}>
          <Select
            multiple
            autoWidth
            value={receipients.slice().split(',')}
            onChange={(e) => updateDraft({
              ...draft,
              receipients: `${receipients},${e.target.value}`,
            })}
            input={(
              <InputBase
                placeholder='Receipient'
                className={classes.input}
                inputProps={{
                  'aria-label': 'Receipient',
                }}
              />
            )}
          >
            {Object.values(contacts).map((contact) => (
              <MenuItem key={contact.id} value={contact.email}>
                {contact.email}
              </MenuItem>
            ))}
          </Select>

          <Divider />
          <div className={classes.input}>
            <Typography variant='caption'>
              {t('SENDER')}
              :
              {' '}
            </Typography>
            <InputBase
              placeholder={t('SENDER')}
              inputProps={{
                'aria-label': 'Sender',
              }}
              value={sender}
              onChange={update('sender')}
            />
          </div>
          <Divider />
          <InputBase
            placeholder={t('SUBJECT')}
            className={classes.subject}
            inputProps={{
              'aria-label': 'Subject',
            }}
            value={subject}
            onChange={update('subject')}
          />
          <br />
          <InputBase
            placeholder={t('CONTENT')}
            className={classes.input}
            multiline
            rows={10}
            inputProps={{
              'aria-label': 'Content',
            }}
            value={content}
            onChange={update('content')}
          />
        </CardContent>
        <CardActions disableactionspacing>
          <Button variant='contained' color='primary' onClick={() => sendDraft(id)}>
            {t('SEND')}
          </Button>
        </CardActions>
      </Card>
    </div>
  )
}

export default withStyles(styles)(EditDraft)
