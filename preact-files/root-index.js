import FatalErrorPage from 'src/pages/FatalErrorPage'
import { render } from 'preact'
import { RedwoodProvider, FatalErrorBoundary } from '@redwoodjs/web'
import Routes from 'src/Routes'

import './index.css'

const App = () => {
  return (
    <FatalErrorBoundary page={FatalErrorPage}>
      <RedwoodProvider>
        <Routes />
      </RedwoodProvider>
    </FatalErrorBoundary>
  )
}
render(<App />, document.getElementById('redwood-app'))