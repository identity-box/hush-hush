import { AnimationBox } from './AnimationBox'

const Wrapper = ({ children, color }) => (
  <div className={`flex flex-col flex-nowrap items-end justify-center ${color ?? 'text-black'}`}>
    {children}
  </div>
)

const Decor = ({ children, color, width }) => {
  let extraStyles = 'w-0'
  if (width !== 'w-0') {
    extraStyles = `${width} transition-[width] ease-in-out duration-1000]`
  }
  return (
    <div className={`border-t-[1px] border-solid ${color ?? 'border-t-black'} ${extraStyles}`}>
      {children}
    </div>
  )
}

const HeaderBox = ({ trigger, color, children }) => (
  <AnimationBox
    startValue='w-0'
    stopValue='w-full'
    key={trigger}
  >
    {
      width =>
        <Wrapper>
          <Wrapper color={color}>
            {children}
            <Decor color={color} width={width} />
          </Wrapper>
        </Wrapper>
    }
  </AnimationBox>
)

export { HeaderBox }
