var documenterSearchIndex = {"docs":
[{"location":"interface/#User-interface","page":"Documentation","title":"User interface","text":"","category":"section"},{"location":"interface/#Sampling","page":"Documentation","title":"Sampling","text":"","category":"section"},{"location":"interface/","page":"Documentation","title":"Documentation","text":"The main entry point for sampling is","category":"page"},{"location":"interface/","page":"Documentation","title":"Documentation","text":"mcmc_with_warmup","category":"page"},{"location":"interface/#DynamicHMC.mcmc_with_warmup","page":"Documentation","title":"DynamicHMC.mcmc_with_warmup","text":"mcmc_with_warmup(rng, ℓ, N; initialization, warmup_stages, algorithm, reporter)\n\n\nPerform MCMC with NUTS, including warmup which is not returned. Return a NamedTuple of\n\nchain, a vector of positions from the posterior\ntree_statistics, a vector of tree statistics\nκ and ϵ, the adapted metric and stepsize.\n\nArguments\n\nrng: the random number generator, eg Random.GLOBAL_RNG.\nℓ: the log density, supporting the API of the LogDensityProblems package\nN: the number of samples for inference, after the warmup.\n\nKeyword arguments\n\ninitialization: see below.\nwarmup_stages: a sequence of warmup stages. See default_warmup_stages and fixed_stepsize_warmup_stages; the latter requires an ϵ in initialization.\nalgorithm: see NUTS. It is very unlikely you need to modify this, except perhaps for the maximum depth.\nreporter: how progress is reported. By default, verbosely for interactive sessions using the log message mechanism (see LogProgressReport, and no reporting for non-interactive sessions (see NoProgressReport).\n\nInitialization\n\nThe initialization keyword argument should be a NamedTuple which can contain the following fields (all of them optional and provided with reasonable defaults):\n\nq: initial position. Default: random (uniform [-2,2] for each coordinate).\nκ: kinetic energy specification. Default: Gaussian with identity matrix.\nϵ: a scalar for initial stepsize, or nothing for heuristic finders.\n\nUsage examples\n\nUsing a fixed stepsize:\n\nmcmc_with_warmup(rng, ℓ, N;\n                 initialization = (ϵ = 0.1, ),\n                 warmup_stages = fixed_stepsize_warmup_stages())\n\nStarting from a given position q₀ and kinetic energy scaled down (will still be adapted):\n\nmcmc_with_warmup(rng, ℓ, N;\n                 initialization = (q = q₀, κ = GaussianKineticEnergy(5, 0.1)))\n\nUsing a dense metric:\n\nmcmc_with_warmup(rng, ℓ, N;\n                 warmup_stages = default_warmup_stages(; M = Symmetric))\n\nDisabling the initial stepsize search (provided explicitly, still adapted):\n\nmcmc_with_warmup(rng, ℓ, N;\n                 initialization = (ϵ = 1.0, ),\n                 warmup_stages = default_warmup_stages(; stepsize_search = nothing))\n\n\n\n\n\n","category":"function"},{"location":"interface/#Warmup","page":"Documentation","title":"Warmup","text":"","category":"section"},{"location":"interface/","page":"Documentation","title":"Documentation","text":"Warmup can be customized.","category":"page"},{"location":"interface/#Default-warmup-sequences","page":"Documentation","title":"Default warmup sequences","text":"","category":"section"},{"location":"interface/","page":"Documentation","title":"Documentation","text":"A warmup sequence is just a tuple of warmup building blocks. Two commonly used sequences are predefined.","category":"page"},{"location":"interface/","page":"Documentation","title":"Documentation","text":"default_warmup_stages\nfixed_stepsize_warmup_stages","category":"page"},{"location":"interface/#DynamicHMC.default_warmup_stages","page":"Documentation","title":"DynamicHMC.default_warmup_stages","text":"default_warmup_stages(; stepsize_search, M, stepsize_adaptation, init_steps, middle_steps, doubling_stages, terminating_steps)\n\n\nA sequence of warmup stages:\n\nselect an initial stepsize using stepsize_search (default: based on a heuristic),\ntuning stepsize with init_steps steps\ntuning stepsize and covariance: first with middle_steps steps, then repeat with twice the steps doubling_stages times\ntuning stepsize with terminating_steps steps.\n\nM (Diagonal, the default or Symmetric) determines the type of the metric adapted from the sample.\n\nThis is the suggested tuner of most applications.\n\nUse nothing for stepsize_adaptation to skip the corresponding step.\n\n\n\n\n\n","category":"function"},{"location":"interface/#DynamicHMC.fixed_stepsize_warmup_stages","page":"Documentation","title":"DynamicHMC.fixed_stepsize_warmup_stages","text":"fixed_stepsize_warmup_stages(; M, middle_steps, doubling_stages)\n\n\nA sequence of warmup stages for fixed stepsize, only tuning covariance: first with middle_steps steps, then repeat with twice the steps doubling_stages times\n\nVery similar to default_warmup_stages, but omits the warmup stages with just stepsize tuning.\n\n\n\n\n\n","category":"function"},{"location":"interface/#wbb","page":"Documentation","title":"Warmup building blocks","text":"","category":"section"},{"location":"interface/","page":"Documentation","title":"Documentation","text":"InitialStepsizeSearch\nFindLocalOptimum\nDualAveraging\nTuningNUTS\nGaussianKineticEnergy","category":"page"},{"location":"interface/#DynamicHMC.InitialStepsizeSearch","page":"Documentation","title":"DynamicHMC.InitialStepsizeSearch","text":"struct InitialStepsizeSearch\n\nParameters for the search algorithm for the initial stepsize.\n\nThe algorithm finds an initial stepsize ϵ so that the local acceptance ratio A(ϵ) satisfies\n\na_textmin  A(ϵ)  a_textmax\n\nThis is achieved by an initial bracketing, then bisection.\n\na_min\nLowest local acceptance rate.\na_max\nHighest local acceptance rate.\nϵ₀\nInitial stepsize.\nC\nScale factor for initial bracketing, > 1. Default: 2.0.\nmaxiter_crossing\nMaximum number of iterations for initial bracketing.\nmaxiter_bisect\nMaximum number of iterations for bisection.\n\nnote: Note\nCf. Hoffman and Gelman (2014), which does not ensure bounds for the acceptance ratio, just that it has crossed a threshold. This version seems to work better for some tricky posteriors with high curvature.\n\n\n\n\n\n","category":"type"},{"location":"interface/#DynamicHMC.DualAveraging","page":"Documentation","title":"DynamicHMC.DualAveraging","text":"struct DualAveraging{T}\n\nParameters for the dual averaging algorithm of Gelman and Hoffman (2014, Algorithm 6).\n\nTo get reasonable defaults, initialize with DualAveraging().\n\nFields\n\nδ\ntarget acceptance rate\nγ\nregularization scale\nκ\nrelaxation exponent\nt₀\noffset\n\n\n\n\n\n","category":"type"},{"location":"interface/#DynamicHMC.TuningNUTS","page":"Documentation","title":"DynamicHMC.TuningNUTS","text":"struct TuningNUTS{M, D}\n\nTune the step size ϵ during sampling, and the metric of the kinetic energy at the end of the block. The method for the latter is determined by the type parameter M, which can be\n\nDiagonal for diagonal metric (the default),\nSymmetric for a dense metric,\nNothing for an unchanged metric.\n\nResults\n\nA NamedTuple with the following fields:\n\nchain, a vector of position vectors\ntree_statistics, a vector of tree statistics for each sample\nϵs, a vector of step sizes for each sample\n\nFields\n\nN\nNumber of samples.\nstepsize_adaptation\nDual averaging parameters.\nλ\nRegularization factor for normalizing variance. An estimated covariance matrix Σ is rescaled by λ towards σ²I, where σ² is the median of the diagonal. The constructor has a reasonable default.\n\n\n\n\n\n","category":"type"},{"location":"interface/#DynamicHMC.GaussianKineticEnergy","page":"Documentation","title":"DynamicHMC.GaussianKineticEnergy","text":"struct GaussianKineticEnergy{T<:(AbstractArray{T,2} where T), S<:(AbstractArray{T,2} where T)} <: DynamicHMC.EuclideanKineticEnergy\n\nGaussian kinetic energy, with K(qp) = p  q  12 pᵀM¹p + logM (without constant), which is independent of q.\n\nThe inverse covariance M¹ is stored.\n\nnote: Note\nMaking M¹ approximate the posterior variance is a reasonable starting point.\n\n\n\n\n\n","category":"type"},{"location":"interface/#Progress-report","page":"Documentation","title":"Progress report","text":"","category":"section"},{"location":"interface/","page":"Documentation","title":"Documentation","text":"Progress reports can be explicit or silent.","category":"page"},{"location":"interface/","page":"Documentation","title":"Documentation","text":"NoProgressReport\nLogProgressReport\nProgressMeterReport","category":"page"},{"location":"interface/#DynamicHMC.NoProgressReport","page":"Documentation","title":"DynamicHMC.NoProgressReport","text":"struct NoProgressReport\n\nA placeholder type for not reporting any information.\n\n\n\n\n\n","category":"type"},{"location":"interface/#DynamicHMC.LogProgressReport","page":"Documentation","title":"DynamicHMC.LogProgressReport","text":"struct LogProgressReport{T}\n\nReport progress into the Logging framework, using @info.\n\nFor the information reported, a step is a NUTS transition, not a leapfrog step.\n\nFields\n\nchain_id\nID of chain. Can be an arbitrary object, eg nothing. Default: nothing\nstep_interval\nAlways report progress past step_interval of the last report. Default: 100\ntime_interval_s\nAlways report progress past this much time (in seconds) after the last report. Default: 1000.0\n\n\n\n\n\n","category":"type"},{"location":"interface/#DynamicHMC.ProgressMeterReport","page":"Documentation","title":"DynamicHMC.ProgressMeterReport","text":"struct ProgressMeterReport\n\nReport progress via a progress bar, using ProgressMeter.jl.\n\nExample usage:\n\njulia> ProgressMeterReport()\n\n\n\n\n\n","category":"type"},{"location":"interface/#Algorithm-and-parameters","page":"Documentation","title":"Algorithm and parameters","text":"","category":"section"},{"location":"interface/","page":"Documentation","title":"Documentation","text":"You probably won't need to change these options with normal usage, except possibly increasing the maximum tree depth.","category":"page"},{"location":"interface/","page":"Documentation","title":"Documentation","text":"DynamicHMC.NUTS","category":"page"},{"location":"interface/#DynamicHMC.NUTS","page":"Documentation","title":"DynamicHMC.NUTS","text":"struct NUTS{S}\n\nImplementation of the “No-U-Turn Sampler” of Hoffman and Gelman (2014), including subsequent developments, as described in Betancourt (2017).\n\nFields\n\nmax_depth\nMaximum tree depth.\nmin_Δ\nThreshold for negative energy relative to starting point that indicates divergence.\nturn_statistic_configuration\nTurn statistic configuration. Currently only Val(:generalized) (the default) is supported.\n\n\n\n\n\n","category":"type"},{"location":"interface/#Inspecting-warmup","page":"Documentation","title":"Inspecting warmup","text":"","category":"section"},{"location":"interface/","page":"Documentation","title":"Documentation","text":"note: Note\nThe warmup interface below is not considered part of the exposed API, and may change with just minor version bump. It is intended for interactive use; the docstrings and the field names of results should be informative.","category":"page"},{"location":"interface/","page":"Documentation","title":"Documentation","text":"DynamicHMC.mcmc_keep_warmup","category":"page"},{"location":"interface/#DynamicHMC.mcmc_keep_warmup","page":"Documentation","title":"DynamicHMC.mcmc_keep_warmup","text":"mcmc_keep_warmup(rng, ℓ, N; initialization, warmup_stages, algorithm, reporter)\n\n\nPerform MCMC with NUTS, keeping the warmup results. Returns a NamedTuple of\n\ninitial_warmup_state, which contains the initial warmup state\nwarmup, an iterable of NamedTuples each containing fields\nstage: the relevant warmup stage\nresults: results returned by that warmup stage (may be nothing if not applicable, or a chain, with tree statistics, etc; see the documentation of stages)\nwarmup_state: the warmup state after the corresponding stage.\nfinal_warmup_state, which contains the final adaptation after all the warmup\ninference, which has chain and tree_statistics, see mcmc_with_warmup.\nsampling_logdensity, which contains information that is invariant to warmup\n\nwarning: Warning\nThis function is not (yet) exported because the the warmup interface may change with minor versions without being considered breaking. Recommended for interactive use.\n\nArguments\n\nrng: the random number generator, eg Random.GLOBAL_RNG.\nℓ: the log density, supporting the API of the LogDensityProblems package\nN: the number of samples for inference, after the warmup.\n\nKeyword arguments\n\ninitialization: see below.\nwarmup_stages: a sequence of warmup stages. See default_warmup_stages and fixed_stepsize_warmup_stages; the latter requires an ϵ in initialization.\nalgorithm: see NUTS. It is very unlikely you need to modify this, except perhaps for the maximum depth.\nreporter: how progress is reported. By default, verbosely for interactive sessions using the log message mechanism (see LogProgressReport, and no reporting for non-interactive sessions (see NoProgressReport).\n\nInitialization\n\nThe initialization keyword argument should be a NamedTuple which can contain the following fields (all of them optional and provided with reasonable defaults):\n\nq: initial position. Default: random (uniform [-2,2] for each coordinate).\nκ: kinetic energy specification. Default: Gaussian with identity matrix.\nϵ: a scalar for initial stepsize, or nothing for heuristic finders.\n\n\n\n\n\n","category":"function"},{"location":"interface/#Stepwise-sampling","page":"Documentation","title":"Stepwise sampling","text":"","category":"section"},{"location":"interface/","page":"Documentation","title":"Documentation","text":"note: Note\nThe stepwise sampling interface below is not considered part of the exposed API, and may change with just minor version bump.","category":"page"},{"location":"interface/","page":"Documentation","title":"Documentation","text":"An experimental interface is available to users who wish to do MCMC one step at a time, eg until some desired criterion about effective sample size or mixing is satisfied. See the docstrings below for an example.","category":"page"},{"location":"interface/","page":"Documentation","title":"Documentation","text":"DynamicHMC.mcmc_steps\nDynamicHMC.mcmc_next_step","category":"page"},{"location":"interface/#DynamicHMC.mcmc_steps","page":"Documentation","title":"DynamicHMC.mcmc_steps","text":"mcmc_steps(rng, algorithm, κ, ℓ, ϵ)\n\n\nReturn a value which can be used to perform MCMC stepwise, eg until some criterion is satisfied about the sample. See mcmc_next_step.\n\nTwo constructors are available:\n\nExplicitly providing\nrng, the random number generator,\nalgorithm, see mcmc_with_warmup,\nκ, the (adapted) metric,\nℓ, the log density callable (see mcmc_with_warmup,\nϵ, the stepsize.\nUsing the fields sampling_logdensity and warmup_state, eg from  mcmc_keep_warmup (make sure you use eg final_warmup_state).\n\nExample\n\n# initialization\nresults = DynamicHMC.mcmc_keep_warmup(RNG, ℓ, 0; reporter = NoProgressReport())\nsteps = mcmc_steps(results.sampling_logdensity, results.final_warmup_state)\nQ = results.final_warmup_state.Q\n\n# a single update step\nQ, tree_stats = mcmc_next_step(steps, Q)\n\n# extract the position\nQ.q\n\n\n\n\n\n","category":"function"},{"location":"interface/#DynamicHMC.mcmc_next_step","page":"Documentation","title":"DynamicHMC.mcmc_next_step","text":"mcmc_next_step(mcmc_steps, Q)\n\n\nGiven Q (an evaluated log density at a position), return the next Q and tree statistics.\n\n\n\n\n\n","category":"function"},{"location":"interface/#Diagnostics","page":"Documentation","title":"Diagnostics","text":"","category":"section"},{"location":"interface/","page":"Documentation","title":"Documentation","text":"note: Note\nStrictly speaking the Diagnostics submodule API is not considered part of the exposed interface, and may change with just minor version bump. It is intended for interactive use.","category":"page"},{"location":"interface/","page":"Documentation","title":"Documentation","text":"DynamicHMC.Diagnostics.explore_log_acceptance_ratios\nDynamicHMC.Diagnostics.summarize_tree_statistics\nDynamicHMC.Diagnostics.leapfrog_trajectory\nDynamicHMC.Diagnostics.EBFMI\nDynamicHMC.PhasePoint","category":"page"},{"location":"interface/#DynamicHMC.Diagnostics.explore_log_acceptance_ratios","page":"Documentation","title":"DynamicHMC.Diagnostics.explore_log_acceptance_ratios","text":"explore_log_acceptance_ratios(ℓ, q, log2ϵs; rng, κ, N, ps)\n\n\nFrom an initial position, calculate the uncapped log acceptance ratio for the given log2 stepsizes and momentums ps, N of which are generated randomly by default.\n\n\n\n\n\n","category":"function"},{"location":"interface/#DynamicHMC.Diagnostics.summarize_tree_statistics","page":"Documentation","title":"DynamicHMC.Diagnostics.summarize_tree_statistics","text":"summarize_tree_statistics(tree_statistics)\n\n\nSummarize tree statistics. Mostly useful for NUTS diagnostics.\n\n\n\n\n\n","category":"function"},{"location":"interface/#DynamicHMC.Diagnostics.leapfrog_trajectory","page":"Documentation","title":"DynamicHMC.Diagnostics.leapfrog_trajectory","text":"leapfrog_trajectory(ℓ, q, ϵ, positions; rng, κ, p)\n\n\nCalculate a leapfrog trajectory visiting positions (specified as a UnitRange, eg -5:5) relative to the starting point q, with stepsize ϵ. positions has to contain 0, and the trajectories are only tracked up to the first non-finite log density in each direction.\n\nReturns a vector of NamedTuples, each containin\n\nz, a PhasePoint object,\nposition, the corresponding position,\nΔ, the log density + the kinetic energy relative to position 0.\n\n\n\n\n\n","category":"function"},{"location":"interface/#DynamicHMC.Diagnostics.EBFMI","page":"Documentation","title":"DynamicHMC.Diagnostics.EBFMI","text":"EBFMI(tree_statistics)\n\n\nEnergy Bayesian fraction of missing information. Useful for diagnosing poorly chosen kinetic energies.\n\nLow values (≤ 0.3) are considered problematic. See Betancourt (2016).\n\n\n\n\n\n","category":"function"},{"location":"interface/#DynamicHMC.PhasePoint","page":"Documentation","title":"DynamicHMC.PhasePoint","text":"struct PhasePoint{T<:DynamicHMC.EvaluatedLogDensity, S}\n\nA point in phase space, consists of a position (in the form of an evaluated log density ℓ at q) and a momentum.\n\n\n\n\n\n","category":"type"},{"location":"#Introduction","page":"Introduction","title":"Introduction","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"DynamicHMC.jl implements a variant of the “No-U-Turn Sampler” of Hoffmann and Gelman (2014), as described in Betancourt (2017).[1] This package is mainly useful for Bayesian inference.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"[1]: In order to make the best use of this package, you should read at least the latter paper thoroughly.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"In order to use it, you should be familiar with the conceptual building blocks of Bayesian inference, most importantly, you should be able to code a (log) posterior as a function in Julia.[2] The package aims to “do one thing and do it well”: given a log density function","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"ell mathbbR^k to mathbbR","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"for which you have values ell(x) and the gradient nabla ell(x), it samples values from a density","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"p(x) propto exp(ell(x))","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"using the algorithm above.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"[2]: For various techniques and a discussion of MCMC methods (eg domain transformations, or integrating out discrete parameters), you may find the Stan Modeling Language manual helpful. If you are unfamiliar with Bayesian methods, I would recommend Bayesian Data Analysis and Statistical Rethinking.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"The interface of DynamicHMC.jl expects that you code ell(x) nablaell(x) using the interface of the LogDensityProblems.jl package. The latter package also allows you to just code ell(x) and obtain nablaell(x) via automatic differentiation.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"While the NUTS algorithm operates on an unrestricted domain mathbbR^k, some parameters have natural restrictions: for example, standard deviations are positive, valid correlation matrices are a subset of all matrices, and structural econometric models can have parameter restrictions for stability. In order to sample for posteriors with parameters like these, domain transformations are required.[3] Also, it is advantageous to decompose a flat vector x to a collection of parameters in a disciplined manner.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"[3]: For nonlinear transformations, correcting with the logarithm of the determinant of the Jacobian is required.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"I recommend that you use TransformVariables.jl in combination with LogdensityProblems.jl for this purpose: it has built-in transformations for common cases, and also allows decomposing vectors into tuples, named tuples, and arrays of parameters, combined with these transformations.","category":"page"},{"location":"#Use-cases","page":"Introduction","title":"Use cases","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"This package has the following intended use cases:","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"A robust and simple engine for MCMC. The intended audience is users who like to code their (log)posteriors directly, optimize and benchmark them as Julia code, and at the same time want to have access detailed diagnostic information from the NUTS sampler.\nA backend for another interface that needs a NUTS implementation.\nA research platform for advances in MCMC methods. The code of this package is extensively documented, and should allow extensions and experiments easily using multiple dispatch. Contributions are always welcome.","category":"page"},{"location":"#Support","page":"Introduction","title":"Support","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"If you have questions, feature requests, or bug reports, please open an issue. I would like to emphasize that it is perfectly fine to open issues just to ask questions. You can also address questions to @Tamas_Papp on the Julia discourse forum.","category":"page"},{"location":"#Versioning-and-interface-changes","page":"Introduction","title":"Versioning and interface changes","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"Package versioning follows Semantic Versioning 2.0. Only major version increments change the API in a breaking manner, but there is no deprecation cycle. You are strongly advised to add a compatibility section to your Project.toml, eg","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"[compat]\nDynamicHMC = \"^2.1\"","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"Only symbols (functions and types) exported directly or indirectly from the DynamicHMC module are considered part of the interface. Importantly, the DynamicHMC.Diagnostics submodule is not considered part of the interface with respect to semantic versioning, and may be changed with just a minor version increment. The rationale for this is that a good generic diagnostics interface is much harder to get right, so some experimental improvements, occasionally reverted or redesigned, will be normal for this package in the medium run. If you depend on this explicitly in non-interactive code, use","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"[compat]\nDynamicHMC = \"~2.1\"","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"There is an actively maintained CHANGELOG which is worth reading after every release, especially major ones.","category":"page"},{"location":"worked_example/#A-worked-example","page":"A worked example","title":"A worked example","text":"","category":"section"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"note: Note\nAn extended version of this example can be found in the DynamicHMCExamples.jl package.","category":"page"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"Consider estimating estimating the parameter 0 le alpha le 1 from n IID observations[4]","category":"page"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"[4]: Note that NUTS is not especially suitable for low-dimensional parameter spaces, but this example works fine.","category":"page"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"y_i sim mathrmBernoulli(alpha)","category":"page"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"We will code this with the help of TransformVariables.jl, and obtain the gradient with ForwardDiff.jl (in practice, at the moment I would recommend ForwardDiff.jl for small models, and Flux.jl for larger ones — consider benchmarking a single evaluation of the log density with gradient).[5]","category":"page"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"[5]: An example of how you can benchmark a log density with gradient ∇P, obtained as described below:using BenchmarkTools, LogDensityProblems\nx = randn(LogDensityProblems.dimension(∇P))\n@benchmark LogDensityProblems.logdensity_and_gradient($∇P, $x)","category":"page"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"First, we load the packages we use.","category":"page"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"using TransformVariables, LogDensityProblems, DynamicHMC,\n    DynamicHMC.Diagnostics, Parameters, Statistics, Random\nnothing # hide","category":"page"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"Generally, I would recommend defining an immutable composite type (ie struct) to hold the data and all parameters relevant for the log density (eg the prior). This allows you to test your code in a modular way before sampling. For this model, the number of draws equal to 1 is a sufficient statistic.","category":"page"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"struct BernoulliProblem\n    n::Int # Total number of draws in the data\n    s::Int # Number of draws `==1` in the data\nend","category":"page"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"Then we make this problem callable with the parameters. Here, we have a single parameter α, but pass this in a NamedTuple to demonstrate a generally useful pattern. Then, we define an instance of this problem with the data, called p.[6]","category":"page"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"[6]: Note that here we used a flat prior. This is generally not a good idea for variables with non-finite support: one would usually make priors parameters of the struct above, and add the log prior to the log likelihood above.","category":"page"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"function (problem::BernoulliProblem)(θ)\n    @unpack α = θ               # extract the parameters\n    @unpack n, s = problem       # extract the data\n    # log likelihood, with constant terms dropped\n    s * log(α) + (n-s) * log(1-α)\nend","category":"page"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"It is generally a good idea to test that your code works by calling it with the parameters; it should return a likelihood. For more complex models, you should benchmark and optimize this callable directly.","category":"page"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"p = BernoulliProblem(20, 10)\np((α = 0.5, )) # make sure that it works","category":"page"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"With TransformVariables.jl, we set up a transformation mathbbR to 01 for alpha, and use the convenience function TransformedLogDensity to obtain a log density in mathbbR^1. Finally, we obtain a log density that supports gradients using automatic differentiation.","category":"page"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"trans = as((α = as𝕀,))\nP = TransformedLogDensity(trans, p)\n∇P = ADgradient(:ForwardDiff, P)","category":"page"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"Finally, we run MCMC with warmup. Note that you have to specify the random number generator explicitly — this is good practice for parallel code. The last parameter is the number of samples.","category":"page"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"results = mcmc_with_warmup(Random.GLOBAL_RNG, ∇P, 1000; reporter = NoProgressReport())\nnothing # hide","category":"page"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"The returned value is a NamedTuple. Most importantly, it contains the field chain, which is a vector of vectors. You should use the transformation you defined above to retrieve the parameters (here, only α). We display the mean here to check that it was recovered correctly.","category":"page"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"posterior = transform.(trans, results.chain)\nposterior_α = first.(posterior)\nmean(posterior_α)","category":"page"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"Using the DynamicHMC.Diagnostics submodule, you can obtain various useful diagnostics. The tree statistics in particular contain a lot of useful information about turning, divergence, acceptance rates, and tree depths for each step of the chain. Here we just obtain a summary.","category":"page"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"summarize_tree_statistics(results.tree_statistics)","category":"page"},{"location":"worked_example/","page":"A worked example","title":"A worked example","text":"note: Note\nUsually one would run parallel chains and check convergence and mixing using generic MCMC diagnostics not specific to NUTS. See MCMCDiagnostics.jl for an implementation of hatR and effective sample size calculations.","category":"page"}]
}
