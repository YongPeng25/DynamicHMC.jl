import DynamicHMC: GaussianKE, Hamiltonian, loggradient, logdensity,
    phasepoint, leapfrog, find_reasonable_ϵ

import ForwardDiff: gradient

######################################################################
# Hamiltonian and leapfrog
######################################################################

@testset "loggradient" begin
    "Test log gradient (using AD on log density)."
    function test_loggradient(ℓ, x)
        ∇ = loggradient(ℓ, x)
        ∇_AD = ForwardDiff.gradient(x->logdensity(ℓ,x), x)
        @test ∇ ≈ ∇_AD
    end

    for _ in 1:10
        κ = GaussianKE(ΣtoU(rand_PDmat(3)))
        for _ in 1:100
            test_loggradient(κ, randn(3))
        end
    end
    for _ in 1:10
        d = normal_density(randn(3), rand_PDmat(3))
        for _ in 1:100
            test_loggradient(d, randn(3))
        end
    end
end

"""
    find_stable_ϵ(κ, Σ)

Return a reasonable estimate for the largest stable stepsize (which
may not be stable, but is a good starting point for finding that).

`Σ` is the (assumed, approximate) variance `q`. `κ` is the kinetic
energy.

Using the transformation ``p̃ = U p``, the kinetic energy is
``p'U'Up/2=p̃'p̃/2``. Transforming to ``q̃=U'⁻¹q``, the variance of which
becomes ``U'⁻¹ Σ U⁻¹'``. Return the square root of its smallest
eigenvalue, following Neal (2011, p 136).

When ``Σ=U'U``, this is ``U'⁻¹ Σ U⁻¹'=I``, and thus decorrelates the
density perfectly.
"""
function find_stable_ϵ(κ::GaussianKE, Σ)
    invU = inv(κ.U)
    √eigmin(invU' * Σ * invU)
end

@testset "leapfrog" begin
    """
    Simple leapfrog implementation. `q`: position, `p`: momentum,
    `∇ℓ`: gradient of logdensity, `ϵ`: stepsize. `m` is the diagonal
    of the kinetic energy ``K(p)=p'M⁻¹p``, defaults to `1`.
    """
    function leapfrog_Gaussian(q, p, ∇ℓ, ϵ, m = ones(length(p)))
        u = .√(1./m)
        pₕ = p + ϵ/2*∇ℓ(q)
        q′ = q + ϵ * u .* (u .* pₕ) # mimic numerical calculation leapfrog performs
        p′ = pₕ + ϵ/2*∇ℓ(q′)
        q′, p′ 
    end

    n = 3
    m = abs.(randn(3))+1
    κ = GaussianKE(chol(inv(Diagonal(m))))
    q = randn(n)
    p = randn(n)
    Σ = rand_PDmat(n)
    ℓ = normal_density(randn(n), Σ)
    ϵ = find_stable_ϵ(κ, Σ)
    ∇ℓ(q) = loggradient(ℓ, q)
    q₂, p₂ = copy(q), copy(p)
    q′, p′ = leapfrog_Gaussian(q, p, ∇ℓ, ϵ, m)
    H = Hamiltonian(ℓ, κ)
    z = phasepoint(H, q, p)
    z′ = leapfrog(H, z, ϵ)

    ⩳(x, y) = isapprox(x, y, rtol = √eps(), atol = √eps())

    @test p == p₂               # arguments not modified
    @test q == q₂
    @test z′.q ⩳ q′
    @test z′.p ⩳ p′

    for i in 1:100
        q, p = leapfrog_Gaussian(q, p, ∇ℓ, ϵ, m)
        z = leapfrog(H, z, ϵ)
        @test z.q ⩳ q
        @test z.p ⩳ p
    end
end

function rand_Hz(N)
    μ = randn(N)
    Σ = rand_PDmat(N)
    U = Diagonal(1./abs.(randn(N)))
    κ = GaussianKE(U)
    H = Hamiltonian(normal_density(μ, Σ), κ)
    z = phasepoint(H, μ)
    H, z
end

@testset "find reasonable ϵ" begin
    for _ in 1:100
        H, z = rand_Hz(rand(3:5))
        a = 0.5
        tol = 0.2
        a = 0.5
        ϵ = find_reasonable_ϵ(H, z; tol = tol, a = a)
        logA = logdensity(H, leapfrog(H, z, ϵ)) - logdensity(H, z)
        @test logA ≈ log(a) atol = tol
    end
end

@testset "leapfrog" begin
    "Test that the Hamiltonian is invariant using the leapfrog integrator."
    function test_hamiltonian_invariance(H, z, L, ϵ; atol = one(ϵ))
        π₀ = logdensity(H, z)
        for _ in 1:L
            z = leapfrog(H, z, ϵ)
            Δ = π₀ - logdensity(H, z)
            @test Δ ≈ 0 atol = atol
        end
    end

    for _ in 1:100
        H, z = rand_Hz(rand(2:5))
        ϵ = find_reasonable_ϵ(H, z)
        test_hamiltonian_invariance(H, z, 100, ϵ/10; atol = 1.0)
    end
end