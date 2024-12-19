### Register Scalable Target cho backend

bash```
aws application-autoscaling register-scalable-target
--service-namespace ecs
--resource-id service/booking-cluster/backend-service
--scalable-dimension ecs:service:DesiredCount
--min-capacity 1
--max-capacity 10
--role-arn arn:aws:iam::171895670589:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling

````

### Scaling Policy cho Backend

bash```
aws application-autoscaling put-scaling-policy
--policy-name backend-cpu-scaling-policy
--service-namespace ecs
--resource-id service/booking-cluster/backend-service
--scalable-dimension ecs:service:DesiredCount
--policy-type TargetTrackingScaling
--target-tracking-scaling-policy-configuration file://backend-cpu-policy.json

````
