# Saintgits College of Engineering portfolio

A responsive, editorial-style portfolio site for Saintgits College of Engineering, Pathamuttom, packaged as a cloud-native delivery reference implementation.

## What is included

- **Website:** accessible single-page experience in `index.html`, `styles.css`, and `app.js`.
- **Event-driven workload:** `functions/contact-interest.mjs` validates contact-interest events and emits structured JSON with a request ID. It is compatible with Node serverless runtimes and deployable with the Knative manifest.
- **Container:** non-root Nginx image with security headers, gzip, health endpoint, read-only runtime support.
- **Kubernetes/OpenShift:** 3 replicas, zero-downtime rolling updates, anti-affinity/topology spread, PDB, HPA (CPU + memory), probes, TLS Ingress, OpenShift Route, RBAC, NetworkPolicy, ConfigMap, Secret template, PVC-ready architecture, and ServiceMonitor.
- **CI/CD:** GitHub Actions runs smoke tests, JavaScript checks, image build, GHCR publication, Trivy scan, and optional cluster deployment.
- **Observability:** Prometheus ServiceMonitor plus an importable Grafana dashboard in `monitoring/grafana-dashboard.json`.

## Run locally

```bash
node --test tests/test-site.mjs
npx --yes serve . -l 8080
# open http://localhost:8080
```

Or with Docker:

```bash
docker compose up --build
# open http://localhost:8080
```

## Publish and deploy

1. Create a GitHub repository and push this directory.
2. In `k8s/deployment.yaml` and `k8s/kustomization.yaml`, replace `OWNER` with the GitHub owner. For a private GHCR image, add an image pull secret.
3. Create the runtime secret without committing it:
   `kubectl -n saintgits create secret generic saintgits-runtime --from-literal=CONTACT_WEBHOOK_URL='https://your-event-sink.example/events'`
4. Configure `KUBE_CONFIG_DATA` as a base64 kubeconfig secret and set repository variable `KUBE_DEPLOY=true` to enable the deployment job.
5. Apply once manually or let Actions apply it:
   `kubectl apply -k k8s/ && kubectl -n saintgits rollout status deployment/saintgits-web`
6. For OpenShift, use `oc apply -k k8s/` and access the generated Route. Supply a real TLS certificate/issuer in the cluster.

## Serverless function

The function is intentionally stateless and logs a redacted structured event. Point `CONTACT_FUNCTION_URL` or an API gateway route at it. A sample Knative Service is at `functions/knative-service.yaml`.

## Live demonstration checklist

```bash
kubectl -n saintgits get deploy,pods,svc,route,hpa,pdb
kubectl -n saintgits rollout status deploy/saintgits-web
kubectl -n saintgits port-forward svc/saintgits-web 8080:80
curl -I http://localhost:8080/
curl http://localhost:8080/healthz
kubectl -n saintgits get --raw '/apis/metrics.k8s.io/v1beta1/nodes' # requires metrics-server
```

A real public registry push, cluster deployment, DNS, TLS certificate, and live URL require credentials and infrastructure outside this workspace; the repository contains the automation and manifests needed to perform those steps.
