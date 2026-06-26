// Build the meet.jit.si call URL for a class group. Opening meet.jit.si as a
// full page (not an iframe) avoids the 5-minute demo cap, so the call is free
// and unlimited. Students join muted; the teacher joins live.
const JITSI_DOMAIN = 'meet.jit.si'

export function buildCallUrl(roomSlug: string, displayName: string, isTeacher: boolean): string {
  return (
    `https://${JITSI_DOMAIN}/${encodeURIComponent(roomSlug)}` +
    `#userInfo.displayName=${encodeURIComponent(`"${displayName}"`)}` +
    `&config.prejoinPageEnabled=false` +
    (isTeacher ? '' : '&config.startWithAudioMuted=true&config.startWithVideoMuted=true')
  )
}
