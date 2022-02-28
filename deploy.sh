#!/bin/bash

ENV=$1

if [[ "$ENV" == "" ]]; then
    echo "Usage: $0 <environment-name> [<profile-name>]"
    exit 2
fi

if [[ "$ENV" != "prod" ]] && [[ "$ENV" != "qa" ]] && [[ "$ENV" != "develop" ]]; then
    echo "ENV is missing, please use [prod|qa|develop]"
    echo "Usage: $0 <environment-name> [<profile-name>]"
    exit 2
fi


if [[ "$ENV" == "develop" ]]; then
  aws s3 rm s3://dev.anton.webapp.fe --recursive && aws s3 sync ./build/ s3://dev.anton.webapp.fe --delete
  aws cloudfront create-invalidation --distribution-id E3N1LVA6BXVGS7 --paths '/*'
fi

if [[ "$ENV" == "prod" ]]; then
  aws s3 rm s3://prod.anton.webapp.fe --recursive && aws s3 sync ./build/ s3://prod.anton.webapp.fe --delete
  aws cloudfront create-invalidation --distribution-id 	E3MBFSLJ4QSSNO --paths '/*'
fi
