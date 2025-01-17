# tfaction

GitHub Actions collection for Opinionated Terraform Workflow

## Goal

Build good Terraform Workflow easily with GitHub Actions.

## Assumption

* GitHub Flow
  * run `terraform plan` or `tfmigrate plan` in pull request CI
  * When a pull request is merged, `terraform apply` or `tfmigrate apply` is run in CI
* Monorepo
  * There are multiple Terraform Working Directory in a repository
* GitHub Actions
* Store terraform plan files and tfmigrate history files at AWS S3
* Manage dependencies with [aqua](https://aquaproj.github.io/)
* Update dependencies with [Renovate](https://github.com/renovatebot/renovate)

## Feature

* [Support tfmigrate](docs/tfmigrate.md)
* [Dynamic Workflow by GitHub Actions build matrix](docs/build-matrix.md)
  * build is run at only changed working directories in the pull request 
* [Apply safely with Terraform Plan file created by Pull Request](docs/plan-file.md)
* Notify the result of terraform plan and apply with [tfcmt](https://github.com/suzuki-shunsuke/tfcmt)
* Support linters
  * terraform validate
  * [tflint](https://github.com/terraform-linters/tflint)
  * [tfsec](https://github.com/aquasecurity/tfsec)
  * [conftest](docs/conftest.md)
* [Update related pull requests automatically when the base branch is updated](docs/auto-update-related-prs.md)
* [Update Terraform Providers and Terraform with Renovate safely](docs/renovate.md)
* [Auto create and update Terraform lock file](https://github.com/suzuki-shunsuke/github-action-terraform-init)
* [Auto format by `terraform fmt`](https://github.com/suzuki-shunsuke/github-action-terraform-fmt)
* [Create a pull request automatically to handle the problem when apply failed](docs/follow-up-pr.md)
* Support AWS OIDC
  * Support changing configuration such as Assume Role ARN per working directory
* [Scaffold working directory by GitHub Actions `workflow_dispatch` event](docs/scaffold-working-dir.md)
* Support configuring GitHub Actions per working directory and job
  * AWS Assume Role ARN, GCP Service Account, GitHub Actions's `runs-on`, `environment`, Secrets, and so on

## Links

* Actions
  * [list-targets](list-targets)
  * [setup](setup)
  * [test](test)
  * [tfmigrate-plan](tfmigrate-plan)
  * [tfmigrate-apply](tfmigrate-apply)
  * [terraform-plan](terraform-plan)
  * [terraform-apply](terraform-apply)
  * [create-follow-up-pr](create-follow-up-pr)
  * [create-scaffold-pr](create-scaffold-pr)
  * [scaffold-working-dir](scaffold-working-dir)
  * [export-secrets](export-secrets)
  * Low Level Actions. These Actions are used internally
    * [get-target-config](get-target-config)
    * [get-global-config](get-global-config)
    * [list-targets-with-changed-files](list-targets-with-changed-files)
    * [list-working-dirs](list-working-dirs)
    * [deploy-ssh-key](deploy-ssh-key)
    * [export-aws-secrets-manager](export-aws-secrets-manager)
* Actions outside of this repository
  * [suzuki-shunsuke/github-action-tflint](https://github.com/suzuki-shunsuke/github-action-tflint)
  * [suzuki-shunsuke/github-action-tfsec](https://github.com/suzuki-shunsuke/github-action-tfsec)
  * [suzuki-shunsuke/github-action-terraform-fmt](https://github.com/suzuki-shunsuke/github-action-terraform-fmt)
* [Set up](docs/setup.md)
* [How to add a working directory](docs/add-working-directory.md)
* [Configuration](docs/config.md)

## Example

https://github.com/suzuki-shunsuke/tfaction-example

## Versioning Policy

[suzuki-shunsuke/versioning-policy v0.1.0](https://github.com/suzuki-shunsuke/versioning-policy/blob/v0.1.0/POLICY.md), which is compatible with [Semantic Versioning 2.0.0](https://semver.org/).

## LICENSE

[MIT](LICENSE)
