/*
This is an example snippet - you should consider tailoring it
to your service.
*/

async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch(
    'https://complete-tapir-68.hasura.app/v1/graphql',
    {
      method: 'POST',
      body: JSON.stringify({
        query: operationsDoc,
        variables: variables,
        operationName: operationName,
      }),
    }
  );

  return await result.json();
}

const operationsDoc = `
  mutation MyMutation {
    insert_users(objects: {email: "arnaldo", id: 10, issuer: "yo", publicAddress: "casa"}) {
      affected_rows
    }
  }
  
  query MyQuery {
    users {
      id
      issuer
      publicAddress
    }
  }
`;

function executeMyMutation() {
  return fetchGraphQL(operationsDoc, 'MyMutation', {});
}

function fetchMyQuery() {
  return fetchGraphQL(operationsDoc, 'MyQuery', {});
}

async function startExecuteMyMutation() {
  const { errors, data } = await executeMyMutation();

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  console.log(data);
}

startExecuteMyMutation();

export async function startFetchMyQuery() {
  const { errors, data } = await fetchMyQuery();

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  console.log(data);
}

startFetchMyQuery();
