import React, { useContext, useEffect } from 'react';
import qs from 'query-string';
import { Card, CardBody } from 'reactstrap';

import { UserContext } from '../../contexts/UserContext';

export default function Index(props) {
  const search = qs.parse(props.location.search);

  const { verifyToken } = useContext(UserContext);

  const verifyUserToken = () => {
    if (search.token) {
      verifyToken(search.token).then((d) => {
        if (d.status !== 200) {
          window.location.replace('/auth/wallet');
          return;
        }
        window.location.replace('/dashboard');
      });
    } else {
      window.location.replace('/auth/wallet');
    }
  };

  useEffect(verifyUserToken, []);

  return (
    <>
      <Card style={{ padding: 100 }}>
        <CardBody>
          <div className="error-body text-center">
            <h4 className="text-dark font-24">Authentication in process!</h4>
            <div className="mt-4">
              <h5 className="mb-0 text-muted font-medium">
                <p>Please wait...</p>
              </h5>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
