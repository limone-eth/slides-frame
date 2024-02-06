import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameInput,
  FrameReducer,
  getPreviousFrame,
  useFramesReducer,
  validateActionSignature,
} from "frames.js/next/server";
import Link from "next/link";
import { BASE_URL } from "../lib/constants";

type State = {
  page: number;
};

const initialState = { page: 1 };

const reducer: FrameReducer<State> = (state, action) => {
  const buttonIndex = action.postBody?.untrustedData.buttonIndex;
  return {
    page:
      state.page === 1 && buttonIndex === 1
        ? 2
        : buttonIndex === 1
        ? state.page - 1
        : buttonIndex === 2
        ? state.page + 1
        : 1,
  };
};

const lastPage = 7;

// This is a react server component only
export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const previousFrame = getPreviousFrame<State>(searchParams);

  const validMessage = await validateActionSignature(previousFrame.postBody);

  const [state, dispatch] = useFramesReducer<State>(
    reducer,
    initialState,
    previousFrame
  );

  console.log(`${BASE_URL}/slide-${state.page}.png`);

  // then, when done, return next frame
  return (
    <div>
      {process.env.NODE_ENV === "development" ? (
        <Link href="/debug">Debug</Link>
      ) : null}
      <FrameContainer
        postUrl="/frames"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage src={`${BASE_URL}/slide-${state.page}.png`} />
        {state.page !== 1 ? (
          <FrameButton onClick={dispatch}>←</FrameButton>
        ) : null}
        {state.page < 7 ? (
          <FrameButton onClick={dispatch}>→</FrameButton>
        ) : null}
        {state.page === 5 ? (
          <FrameButton
            href={
              "https://zora.co/collect/base:0xd45eb7e5f0d3cfc357f30daedb20673a3274c3d7"
            }
          >
            Mint the pass
          </FrameButton>
        ) : null}
        {state.page === 6 ? (
          <FrameButton href={"https://www.weponder.io/surveys/direct/new"}>
            Submit a Q
          </FrameButton>
        ) : null}
        {state.page === 7 ? (
          <FrameButton
            href={
              "https://zora.co/collect/base:0xd45eb7e5f0d3cfc357f30daedb20673a3274c3d7"
            }
          >
            Mint Pass
          </FrameButton>
        ) : null}
      </FrameContainer>
    </div>
  );
}
