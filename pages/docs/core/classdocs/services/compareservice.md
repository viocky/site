---
layout: page
title: CompareService
namespace: Freesewing\Services
tags: [class docs]
permalink: /docs/core/classdocs/services/compareservice
---
## Description 

The [`CompareService`](compareservice) extends the [`DraftService`](draftservice)
but it's best to think of it as a special case of the [`SampleService`](sampleservice).

Like the [`SampleService`](sampleservice), it samples a number of default model sizes for a
given pattern, but in addition will overlay the user's measurements on top of it.

This allows you to **compare** your result to a range of standard sizes.

## Example

{% include coreClassdocsFigure.html
    description="An example of the compare service"
    params="service=compare&pattern=AaronAshirt&mode=measurements&acrossBack=45&bicepsCircumference=33.5&centerBackNeckToWaist=48&chestCircumference=108&naturalWaistToHip=12&neckCircumference=42&shoulderLength=16&shoulderSlope=4&hipsCircumference=95&chestEase=3&armholeDrop=3&lengthBonus=6&necklineBend=100&backlineBend=30&necklineDrop=12&shoulderStrapWidth=4&shoulderStrapPlacement=45&stretchFactor=90&hipsEase=6&samplerGroup=maleStandardUsSizes&theme=Compare&lang=en&unitsIn=metric&unitsOut=metric"
%}


## Typical use

The [`CompareService`](compareservice) is useful to detect anomalities in pattern drafts.

Sometimes, for example when users provide faulty measurements, a pattern can behave erratic.
But in absence of something to compare it to (or familiarity with the pattern) this tends to go unnoticed.

The compare service allows for a simple comparison between a personal draft, and a standard-sized draft.

## Public methods

### getServiceName

```php?start_inline=1
string getServiceName() 
```
Returns the name of the service, which is a `string`. More precisely, this returns `compare`.

### run

```php?start_inline=1
void run(
    \Freesewing\Context $context
) 
```
The `run` method samples the pattern for measurements of the chosen modelgroup,
and adds the users' measurements as an extra model.  It then sets the response and sends it.

Essentially, it takes care of the entire remainder of the request.

While doing so, it takes care of a number of things:

- It asks the [`Channel`](../channels/core/channel) whether this is a valid [`Request`](../src/request)
- It asks the [`Channel`](../channels/core/channel) to standardize the [`Model`](../src/model) measurements and options
- It adds units, a translator, [`Pattern`](../patterns/core/pattern), [`Model`](../src/model), 
[`SvgDocument`](../src/svgdocument), [`SvgRenderbot`](../src/svgrenderbot), and [`MeasurementsSampler`](../src/measurementssampler) to the [`Context`](../src/context)
- It calls [`MeasurementsSamplerPattern::sampleMeasurements`](../src/measurementssampler#samplemeasurements)
- It calls [`Response::send`](../src/response#send)
- It calls [`Context::cleanUp`](../src/context#cleanup)

#### Typical use
{:.no_toc}

Always called from [`Context::runService`](../src/context#runservice).

#### Parameters
{:.no_toc}

- [`Context`](../src/context) `$context` : The [`Context`](../src/context) object


## See also
{% include classFooter.html %}
* TOC - Do not remove this line
{:toc}
