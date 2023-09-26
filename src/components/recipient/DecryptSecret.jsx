import { useCallback, useEffect } from 'react'
import nacl from 'tweetnacl'
import base64url from 'base64url'
import { TypedArrays } from '@react-frontend-developer/buffers'

import { FadingValueBox } from '../animations'
import { Blue, Green, InfoBox, Centered } from '../ui'

const DecryptSecret = ({
  next,
  rendezvousTunnel,
  encryptedSecret,
  theirPublicKey,
  didRecipient
}) => {
  const decryptSecret = useCallback(async () => {
    const encryptedContentBase64 = encryptedSecret.encryptedSymmetricKey
    const nonceBase64 = encryptedSecret.boxNonce
    const message = {
      method: 'decrypt-content',
      params: [
        {
          encryptedContentBase64,
          nonceBase64,
          theirPublicKeyBase64: theirPublicKey,
          didRecipient
        }
      ]
    }
    try {
      await rendezvousTunnel.send(message)
    } catch (e) {
      console.log(e.message)
    }
  }, [
    didRecipient,
    encryptedSecret.boxNonce,
    encryptedSecret.encryptedSymmetricKey,
    rendezvousTunnel,
    theirPublicKey
  ])

  useEffect(() => {
    rendezvousTunnel.onMessage = async (message) => {
      console.log('received message: ', message)
      rendezvousTunnel.closeTunnel()
      const { method, params } = message
      if (method === 'decrypt_content_response' && params) {
        if (params.length > 0) {
          const { decryptedContent } = params[0]
          console.log('decryptedContent=', decryptedContent)
          const box = base64url.toBuffer(encryptedSecret.encryptedSecret)
          const key = base64url.toBuffer(decryptedContent)
          const nonce = base64url.toBuffer(encryptedSecret.secretboxNonce)
          const secret = TypedArrays.uint8Array2string(
            nacl.secretbox.open(box, nonce, key)
          )
          next({ secret })
        }
      } else if (method === 'decrypt_content_error' && params) {
        if (params.length > 0) {
          const { errorID } = params[0]
          console.log('errorID=', errorID)
          next({ errorID })
        }
      } else if (method === 'tunnel-message-decrypt-error' && params) {
        if (params.length > 0) {
          const { errorID } = params[0]
          console.log('errorID=', errorID)
          next({ errorID })
        }
      }
    }
    rendezvousTunnel.onError = (error) => {
      console.log('error: ', error)
    }
    decryptSecret()
    return () => {
      rendezvousTunnel.onMessage = undefined
      rendezvousTunnel.onError = undefined
    }
  }, [
    decryptSecret,
    encryptedSecret.encryptedSecret,
    encryptedSecret.secretboxNonce,
    next,
    rendezvousTunnel
  ])

  return (
    <FadingValueBox>
      <Centered>
        <InfoBox>
          Decrypting your <Blue>secret</Blue> <Green>now...</Green>
        </InfoBox>
      </Centered>
    </FadingValueBox>
  )
}

export { DecryptSecret }
