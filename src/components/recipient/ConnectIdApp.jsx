import { FadingValueBox } from '../animations'
import { Green, Blue, InfoBox, MrSpacer, Centered } from '../ui'

import { Connector } from '../identity'

const ConnectIdApp = ({ closeDialog, rendezvousUrl }) => {
  return (
    <FadingValueBox>
      <Centered>
        <InfoBox>In order to decrypt the secret Hush Hush needs to connect to your <Blue>IdApp</Blue>.</InfoBox>
        <InfoBox cls='mt-[15px]'>This is because the secret can be decrypted using the right private key that is stored on your mobile.</InfoBox>
        <InfoBox cls='mt-[15px]'>The private key will never leave your mobile. <Green>It is thus super safe!</Green></InfoBox>
        <MrSpacer space='20px' />
        <InfoBox>
          Please make sure that you have your <Blue>IdApp</Blue> open on your mobile.
        </InfoBox>
        <MrSpacer space='50px' />
        <Connector
          title='Connect...'
          rendezvousUrl={rendezvousUrl}
          closeDialog={closeDialog}
        />
      </Centered>
    </FadingValueBox>
  )
}

export { ConnectIdApp }
