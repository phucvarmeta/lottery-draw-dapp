import React from 'react';
import { Connector } from 'wagmi';
import { Button } from '../ui/button';

type Props = {
  onClick: () => void;
  isConnecting: boolean;
  isLoading: boolean;
  connector: Connector;
};

export const ConnectorItem = ({ connector, onClick, isConnecting, isLoading }: Props) => {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector, setReady]);

  return (
    <Button
      disabled={isConnecting || !ready}
      loading={isLoading}
      onClick={onClick}
      fullWidth
      size={'lg'}
      variant="default"
    >
      {connector.name}
    </Button>
  );
};
