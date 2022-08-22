import { useState, useRef, useEffect } from 'react'
import { Button } from 'semantic-ui-react'
import base64url from 'base64url'
import { FadingValueBox } from '../animations'
import { Textarea } from '../forms'
import { Green, InfoBox, Centered, MrSpacer } from '../ui'

const CreateLink = ({ cid, did, currentDid }) => {
  const [copied, setCopied] = useState(false)
  const secretField = useRef(undefined)
  const baseUrl = process.env.NODE_ENV === 'development'
    ? (import.meta.env.VITE_HUSH_HUSH_BASEURL ?? 'http://localhost:5173')
    : (import.meta.env.VITE_HUSH_HUSH_BASEURL ?? 'https://hush-hush.xyz')
  const link = `${baseUrl}/secret#${base64url.encode(`${cid}.${did}.${currentDid}`)}`

  const isOS = () => {
    return navigator.userAgent.match(/ipad|iphone/i)
  }

  const clearSelection = () => {
    if (window.getSelection) {
      if (window.getSelection().empty) { // Chrome
        window.getSelection().empty()
      } else if (window.getSelection().removeAllRanges) { // Firefox
        window.getSelection().removeAllRanges()
      }
    } else if (document.selection) { // IE?
      document.selection.empty()
    }
  }

  const selectText = textarea => {
    let range
    let selection
    if (isOS()) {
      range = document.createRange()
      range.selectNodeContents(textarea)
      selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      textarea.setSelectionRange(0, 999999)
    } else {
      textarea.select()
    }
  }

  const onCopy = () => {
    const textarea = document.querySelector('#secret-link')
    selectText(textarea)
    document.execCommand('copy')
    clearSelection()
    setCopied(true)
  }

  const setHeight = () => {
    const area = secretField.current
    area.style.height = `${Number.parseInt(area.scrollHeight, 10) + 10}px`
  }

  useEffect(() => {
    setHeight()
  }, [])

  return (
    <FadingValueBox>
      <Centered>
        <InfoBox cls='mb-5'>Your secret is <Green>ready</Green> to be shared with your hush buddy.</InfoBox>
        <InfoBox cls='mb-5'>Copy it, paste to your favorite email client and send it to the recipient.</InfoBox>
        <InfoBox cls='mb-7'>
          BTW: you can share this link anyway you like. <Green>It is safe. </Green>
          Only your intended hush buddy will be able to decrypt the secret.
          And that&apos;s gorgeous. Isn&apos;t it?
        </InfoBox>
        <Textarea id='secret-link' ref={secretField} css='h-auto' readOnly value={link} />
        <MrSpacer space='30px' />
        <Button primary onClick={onCopy}>{copied ? 'Copied' : 'Copy to clipboard...'}</Button>
      </Centered>
    </FadingValueBox>
  )
}

export { CreateLink }
